"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector} from "@/lib/hooks";
import { fetchRooms} from "@/lib/features/rooms/roomsSlice";
import { EventLog, WeatherData } from "@/types";
import Link from "next/link"
import FilterBar from "@/components/FilterBar";
import { toggleDevice} from "@/lib/features/devices/devicesSlice";
import {addLog} from "@/lib/features/logs/logsSlice";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
    const dispatch = useAppDispatch();
    const { items: rooms, pagination } = useAppSelector((state) => state.rooms);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const logs = useAppSelector((state) => state.logs.items);
    const { t } = useLanguage();

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

    const handleFilterChange = (
        filters: {
            search: string,
            sort: string,
            onlyActiveFilter: boolean }) => {
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

    useEffect(() => {
        fetchData();
        const eventSource = new EventSource("http://localhost:8080/stream-logs");
        eventSource.onopen = () => {
            console.log("Polaczono z SSE")
        };

        eventSource.addEventListener("new-log", (event) => {
            const newLog: EventLog = JSON.parse(event.data);
            dispatch(addLog(newLog));
            dispatch(fetchRooms({
                page: paginationRef.current.currentPage,
                size: 4,
                search: queryParams.search,
                sortBy: queryParams.sortBy
            }));
        });

        eventSource.onerror = (err) => {
            console.error("Blad SSE: ", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
            <LanguageSwitcher />

            <h1 className="text-4xl font-bold mb-8 text-blue-600">🏠 {t.dashboard}</h1>

            <div className="flex gap-4 mb-4">
                <Link href="/devices" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">
                    🔌 {t.devices}
                </Link>
                <Link href="/stats" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition">
                    📊 {t.stats}
                </Link>
            </div>

            {weather && (
                <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
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


                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 h-fit">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">📜 {t.logs}</h2>
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