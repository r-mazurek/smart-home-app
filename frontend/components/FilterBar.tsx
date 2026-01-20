"use client";

import { useState, useEffect } from "react";

interface FilterBarProps {
    onFilterChange: (filters: { search: string; sort: string; onlyActiveFilter: boolean }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");
    const [onlyActiveFilter, setOnlyActiveFilter] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange({ search, sort, onlyActiveFilter });
        }, 500);
        return () => clearTimeout(timer);
    }, [search, sort, onlyActiveFilter, onFilterChange]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">

            <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-medium mb-1">Szukaj</label>
                <input
                    type="text"
                    placeholder="Nazwa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-xs text-gray-500 font-medium mb-1">Sortowanie</label>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border p-2 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="name">Alfabetycznie (A-Z)</option>
                    <option value="id">Po ID (Najnowsze)</option>
                </select>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <input
                    type="checkbox"
                    id="activeFilter"
                    checked={onlyActiveFilter}
                    onChange={(e) => setOnlyActiveFilter(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="activeFilter" className="text-sm text-gray-700 cursor-pointer select-none">
                    Tylko aktywne
                </label>
            </div>

        </div>
    );
}