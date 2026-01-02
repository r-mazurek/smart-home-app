"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector} from "@/lib/hooks";
import { fetchRooms} from "@/lib/features/rooms/roomsSlice";
import { Room, EventLog, WeatherData } from "@/types";
import Link from "next/link"

export default function Home() {
    const dispatch = useAppDispatch();
    const { items: rooms, status, pagination } = useAppSelector((state) => state.rooms);
    const [logs, setLogs] = useState<EventLog[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [newRoomName, setNewRoomName] = useState("");

    const getWeatherIcon = (code: number) => {
        if (code === 0) return "☀️";
        if (code >= 1 && code <= 3) return "⛅";
        if (code >= 45 && code <= 48) return "🌫️";
        if (code >= 51 && code <= 67) return "🌧️";
        if (code >= 71 && code <= 77) return "❄️";
        return "🌡️";
    };

    const fetchData = async () => {
        dispatch(fetchRooms({ page: 0 }));

        try {
            const weatherRes = await fetch("http://localhost:8080/weather");
            if (weatherRes.ok) {
                const weatherData = await weatherRes.json();
                setWeather(weatherData);
            }
        } catch (error) {
            console.error("Błąd połączenia z API:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const eventSource = new EventSource("http://localhost:8080/stream-logs");
        eventSource.onopen = () => {
            console.log("Polaczono z SSE")
        };

        eventSource.addEventListener("new-log", (event) => {
            const newLog: EventLog = JSON.parse(event.data);
            setLogs((prevLogs) => [newLog, ...prevLogs]);
            dispatch(fetchRooms({ page: 0 }));
        });

        eventSource.onerror = (err) => {
            console.error("Blad SSE: ", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };

    }, [dispatch]);

    const handleAddRoom = async () => {
        if (!newRoomName) return;
        await fetch(`http://localhost:8080/rooms/${newRoomName}`, { method: "POST" });
        setNewRoomName("");
        dispatch(fetchRooms({ page: 0 }));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            dispatch(fetchRooms({ page: newPage }));
        }
    };

    const toggleDevice = async (roomName: string, deviceId: number) => {
        await fetch(`http://localhost:8080/rooms/${roomName}/devices/${deviceId}`, {
            method: "POST",
        });
        dispatch(fetchRooms({ page: 0 }));
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">🏠 Smart Home Dashboard</h1>

            {weather && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
                    <span className="text-4xl">{getWeatherIcon(weather.current_weather.weathercode)}</span>
                    <div>
                        <p className="text-2xl font-bold">{weather.current_weather.temperature}°C</p>
                        <p className="text-sm opacity-90">Wiatr: {weather.current_weather.windspeed} km/h</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KOLUMNA 1 i 2: POKOJE */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Formularz dodawania */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Zarządzanie domem</span>
                        <Link
                            href="/rooms/add"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            + Dodaj Pokój
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms.map((room) => (
                            <div key={room.id || room.name} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <Link href={`/rooms/${room.id}`} className="hover:text-blue-600 hover:underline">
                                        <h2 className="text-xl font-semibold text-gray-700">{room.name}</h2>
                                    </Link>
                                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">ID: {room.id}</span>
                                </div>

                                {room.devices.length === 0 ? (
                                    <p className="text-gray-400 text-sm">Brak urządzeń</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {room.devices.map((device) => (
                                            <li key={device.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <span className={device.isOn ? "font-bold text-green-600" : "text-gray-500"}>
                          {device.name}
                        </span>
                                                <button
                                                    onClick={() => {
                                                        toggleDevice(room.name, device.id)
                                                    }}
                                                    className={`px-4 py-1 rounded text-sm transition ${
                                                        device.isOn
                                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                                    }`}
                                                >
                                                    {device.isOn ? "ON" : "OFF"}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* DODAJ URZADZENIE TUTAJ */}
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
                            &larr; Poprzednia
                        </button>

                        <span className="text-gray-600">
                Strona {pagination.currentPage + 1} z {pagination.totalPages}
            </span>

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage + 1 >= pagination.totalPages}
                            className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
                        >
                            Następna &rarr;
                        </button>
                    </div>
                </div>


                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">📜 Historia Zdarzeń</h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {logs.length === 0 && <p className="text-gray-400">Brak logów...</p>}
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