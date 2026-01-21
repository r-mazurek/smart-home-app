"use client";

import {useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchStats } from "@/lib/features/stats/statsSlice";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

const COLORS = ["#10B981", "#EF4444"];

export default function StatsPage() {
    const dispatch = useAppDispatch();
    const { devicesPerRoom, deviceStatus, status } = useAppSelector((state) => state.stats);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    const { t } = useLanguage()

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-800 font-sans">
            <LanguageSwitcher />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <Link href="/" className="text-sm text-gray-500 hover:underline">{t.backToDashboard}</Link>
                    <h1 className="text-3xl font-bold text-indigo-600 mt-2">📊 {t.statsTitle}</h1>
                </div>
            </div>

            {status === 'loading' && <p>{t.loading}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 text-gray-700">{t.chartRooms}</h2>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <BarChart data={devicesPerRoom}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name={t.devicesAmountChartLegend} fill="#6366F1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h2 className="text-xl font-semibold mb-6 text-gray-700">{t.chartStatus}</h2>
                    <div style={{ width: '100%', height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                            <PieChart>
                                <Pie
                                    data={deviceStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {deviceStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-2">{t.summaryTitle}</h3>
                    <p className="opacity-90">
                        {t.summaryText(devicesPerRoom.reduce((acc, curr) => acc + curr.value, 0), devicesPerRoom.length)}
                    </p>
                </div>

            </div>
        </main>
    );
}