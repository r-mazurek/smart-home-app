"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchDevices, toggleDevice, renameDevice, deleteDevice } from "@/lib/features/devices/devicesSlice";
import FilterBar from "@/components/FilterBar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {useLanguage} from "@/context/LanguageContext";

export default function DevicesPage() {
    const dispatch = useAppDispatch();
    const { items: devices, status, pagination } = useAppSelector((state) => state.devices);
    const { t } = useLanguage();

    const [queryParams, setQueryParams] = useState({
        search: "",
        sort: "name",
        onlyActiveFilter: false
    })

    useEffect(() => {
        dispatch(fetchDevices({
            page: 0,
            size: 10,
            search: queryParams.search,
            sortBy: queryParams.sort,
            direction: "asc"
        }));
    }, [dispatch, queryParams.search, queryParams.sort]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            dispatch(fetchDevices({
                page: newPage,
                size: 10,
                search: queryParams.search,
                sortBy: queryParams.sort
            }));
        }
    };

    const handleFilterChange = (filters: {
        search: string,
        sort: string,
        onlyActiveFilter: boolean
        }) => {
        setQueryParams(filters);
    };

    const displayedDevices = queryParams.onlyActiveFilter
        ? devices.filter(device => device.isOn)
        : devices;

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
            <LanguageSwitcher />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/" className="text-sm text-gray-500 hover:underline">{t.backToDashboard}</Link>
                    <h1 className="text-3xl font-bold text-blue-600 mt-2">🔌 {t.allDevices}</h1>
                </div>
            </div>

            <FilterBar onFilterChange={handleFilterChange} />

            {status === 'loading' && <p>{t.loading}</p>}

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">{t.name}</th>
                        <th className="p-4 font-semibold text-gray-600">{t.type}</th>
                        <th className="p-4 font-semibold text-gray-600">{t.state}</th>
                        <th className="p-4 font-semibold text-gray-600">{t.connectedRoom}</th>
                        <th className="p-4 font-semibold text-gray-600">{t.actions}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayedDevices.map((device) => (
                        <tr key={device.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-4 font-medium">
                                {device.name}
                                {device.temperature !== undefined && device.temperature !== null && device.isOn && (
                                    <span className="ml-2 text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      {device.temperature}°C
                                    </span>
                                )}
                            </td>

                            <td className="p-4 text-sm text-gray-500 uppercase">{device.deviceType}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => dispatch(toggleDevice(device.id))}
                                    className={`
                                        px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm transition-all duration-200
                                        hover:scale-105 active:scale-95
                                        ${device.isOn
                                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_16px_rgba(34,197,94,0.4)]"
                                        : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400"
                                        }
        `                           }
                                >
                                    {device.isOn ? "ON" : "OFF"}
                                </button>
                            </td>
                            <td className="p-4">
                                {device.room ? (
                                    <Link href={`/rooms/${device.room.id}`} className="text-blue-600 hover:underline">
                                        🏠 {device.room.name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-400">{t.noConnectedRoom}</span>
                                )}
                            </td>
                            <td className="p-4 flex gap-2">
                                <button
                                    onClick={() => {
                                        const newName = window.prompt(t.newName, device.name);
                                        if (newName) dispatch(renameDevice({ id: device.id, newName }));
                                    }}
                                    className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => {
                                        if(confirm(t.deviceDeleteQuestion)) dispatch(deleteDevice(device.id));
                                    }}
                                    className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Paginacja */}
            <div className="mt-6 flex justify-center gap-4">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                    {t.previousPage}
                </button>
                <span className="py-2">{t.page} {pagination.currentPage + 1} {t.of} {pagination.totalPages || 1}</span>
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage + 1 >= pagination.totalPages}
                    className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                    {t.nextPage}
                </button>
            </div>
        </main>
    );
}