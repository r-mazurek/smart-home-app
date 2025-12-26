"use client";

import { useState, useEffect } from "react";
import { Room, EventLog } from "@/types";

export default function Home() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [logs, setLogs] = useState<EventLog[]>([]);
    const [newRoomName, setNewRoomName] = useState("");

    const fetchData = async () => {
        try {
            const roomsRes = await fetch("http://localhost:8080/rooms");
            if (roomsRes.ok) {
                const roomsData = await roomsRes.json();
                setRooms(Array.isArray(roomsData) ? roomsData : Object.values(roomsData));
            }

            const logsRes = await fetch("http://localhost:8080/logs");
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setLogs(logsData);
            }
        } catch (error) {
            console.error("Błąd połączenia z API:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleAddRoom = async () => {
        if (!newRoomName) return;
        await fetch(`http://localhost:8080/rooms/${newRoomName}`, { method: "POST" });
        setNewRoomName("");
        fetchData()
    };

    const toggleDevice = async (roomName: string, deviceId: number) => {
        await fetch(`http://localhost:8080/rooms/${roomName}/devices/${deviceId}`, {
            method: "POST",
        });
        fetchData();
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">🏠 Smart Home Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* KOLUMNA 1 i 2: POKOJE */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Formularz dodawania */}
                    <div className="bg-white p-4 rounded-xl shadow-sm flex gap-2">
                        <input
                            type="text"
                            placeholder="Nazwa nowego pokoju..."
                            className="border p-2 rounded flex-grow"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                        />
                        <button
                            onClick={handleAddRoom}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition"
                        >
                            Dodaj
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms.map((room) => (
                            <div key={room.id || room.name} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-700">{room.name}</h2>

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
                                                    onClick={() => toggleDevice(room.name, device.id)}
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