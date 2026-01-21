"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {addDeviceToRoom, deleteRoom, fetchRooms} from "@/lib/features/rooms/roomsSlice";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DeviceForm from "@/components/DeviceForm";
import {useLanguage} from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { toggleDevice, deleteDevice, renameDevice} from "@/lib/features/devices/devicesSlice";

export default function RoomDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { items: rooms, status } = useAppSelector((state) => state.rooms);
    const [ showAddDevice, setShowAddDevice ] = useState(false);

    const { t } = useLanguage();

    const handleAddDevice = async (values: { name: string, deviceType: string }) => {
        if (!room) return;

        console.log("handling add device :)")

        await dispatch(addDeviceToRoom({
            roomName: room.name,
            deviceName: values.name,
            deviceType: values.deviceType
        }));

        setShowAddDevice(false);
    };

    const handleDelete = async () => {
        if (!room) return;
        if (confirm(t.sureWantToDeleteRoomMessage)) {
            await dispatch(deleteRoom(room.name));
            router.push('/');
        }
    }

    const room = rooms.find((r) => r.id === Number(id));

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRooms());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <div className="p-8">{t.loading}</div>;
    if (!room) return <div className="p-8">{t.roomNotFound} <Link href="/" className="text-blue-500">{t.back}</Link></div>;

    return (
        <main className="min-h-screen p-8 bg-gray-50 font-sans">
            <LanguageSwitcher />

            {/* powrot */}
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                {t.backToDashboard}
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
            ID: {room.id}
          </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">{t.devicesInRoom}</h2>

                    {/* Przycisk otwierający formularz */}
                    <button
                        onClick={() => setShowAddDevice(!showAddDevice)}
                        className="text-sm text-blue-600 hover:underline font-medium"
                    >
                        {showAddDevice ? t.cancel : `+ ${t.addDevice}`}
                    </button>
                </div>

                {/* warunkowe wyświetlanie formularza */}
                {showAddDevice && (
                    <div className="mb-6 animate-fade-in">
                        <DeviceForm onSubmit={handleAddDevice} />
                    </div>
                )}

                {room.devices.length === 0 ? (
                    <p className="text-gray-400">{t.noDevicesInThisRoom}</p>
                ) : (
                    <ul className="space-y-3">
                        {room.devices.map((device) => (
                            <li key={device.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 group hover:border-blue-200 transition-colors">

                                {/* LEWA STRONA: Nazwa i Temperatura */}
                                <div className="flex items-center gap-3">
        <span className={`font-medium transition ${device.isOn ? "text-green-700" : "text-gray-600"}`}>
            {device.name}
        </span>
                                    {device.temperature !== undefined && device.temperature !== null && device.isOn && (
                                        <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded shadow-sm">
                {device.temperature}°C
            </span>
                                    )}
                                </div>

                                {/* PRAWA STRONA: Przyciski */}
                                <div className="flex items-center gap-3">

                                    {/* Przycisk ON/OFF z Efektem 3D i Glow */}
                                    <button
                                        onClick={() => dispatch(toggleDevice(device.id))}
                                        className={`
                px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all duration-200
                hover:scale-105 active:scale-95
                ${device.isOn
                                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)]"
                                            : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400"
                                        }
            `}
                                    >
                                        {device.isOn ? "ON" : "OFF"}
                                    </button>

                                    {/* Separator */}
                                    <div className="h-4 w-px bg-gray-300 mx-1"></div>

                                    {/* Edycja (✏️) */}
                                    <button
                                        onClick={() => {
                                            const newName = window.prompt("Nowa nazwa urządzenia:", device.name);
                                            if (newName && newName !== device.name) {
                                                dispatch(renameDevice({ id: device.id, newName }));
                                            }
                                        }}
                                        className="text-gray-400 hover:text-blue-600 hover:scale-110 transition p-1"
                                        title="Zmień nazwę"
                                    >
                                        ✏️
                                    </button>

                                    {/* Usuwanie (🗑️) */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Czy na pewno usunąć urządzenie: ${device.name}?`)) {
                                                dispatch(deleteDevice(device.id));
                                            }
                                        }}
                                        className="text-gray-400 hover:text-red-600 hover:scale-110 transition p-1"
                                        title="Usuń urządzenie"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-8 border-t pt-6 flex gap-4">
                    {/* przyciski edycji */}
                    <Link
                        href={`/rooms/${id}/edit`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                        {t.editRoom}
                    </Link>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        {t.deleteRoom}
                    </button>
                </div>
            </div>
        </main>
    );
}