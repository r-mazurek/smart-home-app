"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchDevices } from "@/lib/features/devices/devicesSlice";
import FilterBar from "@/components/FilterBar";

export default function DevicesPage() {
    const dispatch = useAppDispatch();
    const { items: devices, status, pagination } = useAppSelector((state) => state.devices);

    const [queryParams, setQueryParams] = useState({
        search: "",
        sort: "name",
        onlyActive: false
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
        onlyActive: boolean
    }) => {
        setQueryParams(filters);
    }

    const displayedDevices = queryParams.onlyActive
        ? devices.filter(device => device.isOn)
        : devices;

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/" className="text-sm text-gray-500 hover:underline">← Wróć do Dashboardu</Link>
                    <h1 className="text-3xl font-bold text-blue-600 mt-2">🔌 Wszystkie Urządzenia</h1>
                </div>
            </div>

            <FilterBar onFilterChange={handleFilterChange} />

            {status === 'loading' && <p>Ładowanie urządzeń...</p>}

            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-4 font-semibold text-gray-600">Nazwa</th>
                        <th className="p-4 font-semibold text-gray-600">Typ</th>
                        <th className="p-4 font-semibold text-gray-600">Stan</th>
                        <th className="p-4 font-semibold text-gray-600">Pokój (Powiązanie)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {devices.map((device) => (
                        <tr key={device.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="p-4 font-medium">{device.name}</td>
                            <td className="p-4 text-sm text-gray-500 uppercase">{device.deviceType}</td>
                            <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${device.isOn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {device.isOn ? "ON" : "OFF"}
                  </span>
                            </td>
                            <td className="p-4">
                                {device.room ? (
                                    <Link href={`/rooms/${device.room.id}`} className="text-blue-600 hover:underline">
                                        🏠 {device.room.name}
                                    </Link>
                                ) : (
                                    <span className="text-gray-400">Brak przypisania</span>
                                )}
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
                    Poprzednia
                </button>
                <span className="py-2">Strona {pagination.currentPage + 1} z {pagination.totalPages || 1}</span>
                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage + 1 >= pagination.totalPages}
                    className="px-4 py-2 bg-white border rounded disabled:opacity-50"
                >
                    Następna
                </button>
            </div>
        </main>
    );
}