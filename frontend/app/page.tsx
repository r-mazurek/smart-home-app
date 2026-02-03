"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchRooms } from "@/lib/features/rooms/roomsSlice";
import { EventLog, WeatherData } from "@/types";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import { toggleDevice } from "@/lib/features/devices/devicesSlice";
import {addLog, clearLogs} from "@/lib/features/logs/logsSlice";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import mqtt from "mqtt";

export default function Home() {
    const dispatch = useAppDispatch();
    const { items: rooms, pagination } = useAppSelector((state) => state.rooms);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const logs = useAppSelector((state) => state.logs.items);
    const { t } = useLanguage();

    // Login & Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between Login/Register
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // Logs & Protocol State
    const [logSource, setLogSource] = useState<"SSE" | "MQTT">("SSE");
    const [connectionStatus, setConnectionStatus] = useState("disconnected");

    const getWeatherIcon = (code: number) => {
        if (code === 0) return "☀️";
        if (code >= 1 && code <= 3) return "⛅";
        if (code >= 45 && code <= 48) return "🌫️";
        if (code >= 51 && code <= 67) return "🌧️";
        if (code >= 71 && code <= 77) return "❄️";
        return "🌡️";
    };

    const [queryParams, setQueryParams] = useState({
        search: "",
        sortBy: "name",
        direction: "asc"
    });

    const [onlyActiveFilter, setOnlyActiveFilter] = useState(false);

    const paginationRef = useRef(pagination);
    const queryParamsRef = useRef(queryParams);

    useEffect(() => {
        paginationRef.current = pagination;
        queryParamsRef.current = queryParams;
    }, [pagination, queryParams]);

    useEffect(() => {
        if (document.cookie.includes("client_login=true")) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleFilterChange = (
        filters: {
            search: string,
            sort: string,
            onlyActiveFilter: boolean
        }) => {
        setQueryParams((prev) => ({
            ...prev,
            search: filters.search,
            sortBy: filters.sort,
        }));

        setOnlyActiveFilter(filters.onlyActiveFilter);

        dispatch(fetchRooms({
            page: paginationRef.current.currentPage,
            size: 4,
            search: filters.search,
            sortBy: filters.sort,
            direction: "asc"
        }));
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isRegistering) {
                const role = username.toString().toLowerCase().includes("admin") ? "admin" : "user";
                const res = await fetch(`http://localhost:8080/users/${username}?password=${password}&role=${role}`, {
                    method: "POST",
                });
                if (res.ok) {
                    alert("Rejestracja udana! Możesz się teraz zalogować.");
                    setIsRegistering(false);
                } else {
                    alert("Błąd rejestracji.");
                }
            } else {
                const formData = new FormData();
                formData.append("username", username);
                formData.append("password", password);

                const res = await fetch("http://localhost:8080/users/login", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                });

                if (res.ok) {
                    setIsLoggedIn(true);
                    // Set a simple client-side cookie to remember login state
                    document.cookie = "client_login=true; max-age=3600; path=/";
                } else {
                    alert("Błąd logowania - niepoprawne dane.");
                }
            }
        } catch (err) {
            console.error(err);
            alert("Błąd połączenia z serwerem.");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/users/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.error("Błąd wylogowania na backendzie", err);
        }

        document.cookie = "client_login=; max-age=0; path=/";
        setIsLoggedIn(false);
        setUsername("");
        setPassword("");
        setLogSource("SSE");
    };

    useEffect(() => {
        if (!isLoggedIn) return;

        fetchData();

        let eventSource: EventSource | null = null;
        let mqttClient: mqtt.MqttClient | null = null;

        setConnectionStatus("connecting...");

        if (logSource === "SSE") {
            // === SSE MODE ===
            eventSource = new EventSource("http://localhost:8080/stream-logs");
            eventSource.onopen = () => setConnectionStatus("connected");

            eventSource.addEventListener("new-log", (event) => {
                const newLog: EventLog = JSON.parse(event.data);
                dispatch(addLog(newLog));
            });

            eventSource.onerror = () => {
                setConnectionStatus("Error");
                eventSource?.close();
            };
        } else {
            // === MQTT MODE ===
            // Using port 8083 which is standard for WebSockets on EMQX
            const brokerUrl = "ws://broker.emqx.io:8083/mqtt";

            mqttClient = mqtt.connect(brokerUrl, {
                clientId: "nextjs_client_" + Math.random().toString(16).substring(2, 8),
            });

            mqttClient.on("connect", () => {
                setConnectionStatus("connected");
                mqttClient?.subscribe("smarthome/devices");
                mqttClient?.subscribe("smarthome/logs"); // Subscribe to logs topic as well
            });

            mqttClient.on("message", (topic, message) => {
                // Accept logs from both topics just in case
                if (topic === "smarthome/devices" || topic === "smarthome/logs") {
                    try {
                        const payload = message.toString();
                        // Sometimes MQTT sends plain text, try to parse or wrap it
                        let newLog: EventLog;
                        try {
                            newLog = JSON.parse(payload);
                        } catch {
                            // If not JSON, wrap it
                            newLog = {
                                id: Date.now(),
                                eventType: "MQTT_MSG",
                                message: payload,
                                timestamp: new Date().toISOString()
                            };
                        }
                        dispatch(addLog(newLog));
                    } catch (err) {
                        console.error(err);
                    }
                }
            });

            mqttClient.on("error", (err) => {
                console.error("MQTT Error:", err);
                setConnectionStatus("Error");
            });
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, [logSource, isLoggedIn]);

    const fetchData = async () => {
        dispatch(fetchRooms({ page: 0 }));

        try {
            const weatherRes = await fetch("http://localhost:8080/weather");
            if (weatherRes.ok) {
                const weatherData: WeatherData = await weatherRes.json();
                setWeather(weatherData);
            }
        } catch (error) {
            console.error("Błąd połączenia z API:", error);
        }
    };

    const displayedRooms = onlyActiveFilter
        ? rooms.filter(room => room.devices.some((d) => d.isOn))
        : rooms;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            dispatch(fetchRooms({
                page: newPage,
                size: 4,
                search: queryParams.search,
                sortBy: queryParams.sortBy,
                direction: queryParams.direction
            }));
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl shadow-lg w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                        {isRegistering ? "📝 Rejestracja" : "🔐 Smart Home Login"}
                    </h2>
                    <input
                        type="text" placeholder="Użytkownik" className="w-full mb-4 p-2 border rounded"
                        value={username} onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Hasło" className="w-full mb-6 p-2 border rounded"
                        value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-4">
                        {isRegistering ? "Zarejestruj się" : "Zaloguj się"}
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        {isRegistering ? "Masz już konto? " : "Nie masz konta? "}
                        <button
                            type="button"
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-blue-600 underline font-bold"
                        >
                            {isRegistering ? "Zaloguj się" : "Zarejestruj się"}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
            <LanguageSwitcher />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">🏠 {t.dashboard}</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-2 font-bold"
                >
                    🚪 {t ? t.logout || "Wyloguj" : "Logout"}
                </button>
            </div>

            <div className="flex gap-4 mb-4">
                <Link href="/devices" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">
                    🔌 {t.devices}
                </Link>
                <Link href="/stats" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">
                    📊 {t.stats}
                </Link>
            </div>

            {weather && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 mb-8">
                    <span className="text-4xl">{getWeatherIcon(weather.current_weather.weathercode)}</span>
                    <div>
                        <p className="text-2xl font-bold">{weather.current_weather.temperature}°C</p>
                        <p className="text-sm opacity-90">{t.wind}: {weather.current_weather.windspeed} km/h</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KOLUMNA 1 i 2: POKOJE */}
                <div className="lg:col-span-2 space-y-6">

                    <FilterBar onFilterChange={handleFilterChange} />

                    {/* Formularz dodawania */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600 font-medium">{t.roomManagement}</span>
                        <Link
                            href="/rooms/add"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            + {t.addRoom}
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {displayedRooms.map((room) => (
                            <div key={room.id || room.name}
                                 className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                                <div className="h-32 bg-gray-200 relative rounded-xl overflow-hidden mb-4">
                                    <Image
                                        src={`https://picsum.photos/seed/${room.id}/400/200`}
                                        alt={room.name}
                                        width={400}
                                        height={200}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        loading="eager"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                        ID: {room.id}
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <Link href={`/rooms/${room.id}`} className="hover:text-blue-600 hover:underline">
                                        <h2 className="text-xl font-semibold text-gray-700">{room.name}</h2>
                                    </Link>
                                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">ID: {room.id}</span>
                                </div>

                                {room.devices.length === 0 ? (
                                    <p className="text-gray-400 text-sm">{t.noDevices}</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {room.devices.map((device) => (
                                            <li key={device.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                <span className={device.isOn ? "font-bold text-green-600" : "text-gray-500"}>
                                                    {device.name}
                                                </span>
                                                {device.temperature !== undefined && device.temperature !== null && device.isOn && (
                                                    <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                        {device.temperature}°C
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() => dispatch(toggleDevice(device.id))}
                                                    className={`
                                                        px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all duration-200
                                                        hover:scale-105 active:scale-95
                                                        ${device.isOn
                                                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)]"
                                                        : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400"
                                                    }
    `                                               }
                                                >
                                                    {device.isOn ? (t ? t.on : "ON") : (t ? t.off : "OFF")}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Paginacja */}
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 0}
                            className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
                        >
                            &larr; {t.previousPage}
                        </button>

                        <span className="text-gray-600">
                            {t.page} {pagination.currentPage + 1} {t.of} {pagination.totalPages}
                        </span>

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage + 1 >= pagination.totalPages}
                            className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
                        >
                            {t.nextPage} &rarr;
                        </button>
                    </div>
                </div>

                {/* --- 3. LOGS COLUMN WITH PROTOCOL SWITCHER --- */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 h-fit">
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold text-gray-700">📜 {t.logs}</h2>

                        {/* PROTOCOL SWITCHER INSIDE LOGS HEADER */}
                        <div className="flex flex-row items-center gap-6">
                            <button
                                onClick={() => setLogSource(prev => prev === "SSE" ? "MQTT" : "SSE")}
                                className={`px-3 py-1 rounded-full text-xs font-bold mb-1 transition-all border ${
                                    logSource === "SSE"
                                        ? "bg-green-100 text-green-700 border-green-300"
                                        : "bg-blue-100 text-blue-700 border-blue-300"
                                }`}
                            >
                                📡 {logSource} 🔄
                            </button>

                            <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                connectionStatus.includes("connected") ? "text-green-500" : "text-red-500"
                            }`}>
                                {connectionStatus}
                            </span>

                            <button
                                onClick={() => dispatch(clearLogs())}
                                className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                            >
                                🗑️ {t.clearLogs}
                            </button>

                        </div>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {logs.length === 0 && <p className="text-gray-400">{t.noLogs}</p>}
                        {logs.map((log) => (
                            <div key={log.id} className="text-sm border-b pb-2 last:border-0">
                                <p className="font-medium text-gray-800">{log.message}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                    <span className="ml-2 text-blue-400">{log.eventType}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}