"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchRooms } from "@/lib/features/rooms/roomsSlice";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RoomDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { items: rooms, status } = useAppSelector((state) => state.rooms);

    const room = rooms.find((r) => r.id === Number(id));

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRooms());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <div className="p-8">Ładowanie danych...</div>;
    if (!room) return <div className="p-8">Nie znaleziono pokoju! <Link href="/" className="text-blue-500">Wróć</Link></div>;

    return (
        <main className="min-h-screen p-8 bg-gray-50 font-sans">
            {/* powrot */}
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                &larr; Wróć do Dashboardu
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
            ID: {room.id}
          </span>
                </div>

                {/* urzadzenia */}
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Urządzenia w pokoju</h2>

                {room.devices.length === 0 ? (
                    <p className="text-gray-400">Brak urządzeń w tym pokoju.</p>
                ) : (
                    <ul className="space-y-3">
                        {room.devices.map((device) => (
                            <li key={device.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                                <span className="font-medium text-lg">{device.name}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                    device.isOn ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                                }`}>
                  {device.isOn ? "WŁĄCZONE" : "WYŁĄCZONE"}
                </span>
                                {/* przyciski usun/edutyj */}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-8 border-t pt-6 flex gap-4">
                    {/* przyciski edycji */}
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                        Edytuj Pokój
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        Usuń Pokój
                    </button>
                </div>
            </div>
        </main>
    );
}