"use client";

import { useEffect } from "react";
import RoomForm from "@/components/RoomForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchRooms, updateRoom } from "@/lib/features/rooms/roomsSlice";
import { useRouter, useParams } from "next/navigation";
import {useLanguage} from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function EditRoomPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { items: rooms, status } = useAppSelector((state) => state.rooms);
    const roomToEdit = rooms.find((r) => r.id === Number(id));

    const { t } = useLanguage();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRooms());
        }
    }, [status, dispatch]);

    const handleUpdate = async (values: { name: string }) => {
        if (!roomToEdit) return;

        await dispatch(updateRoom({
            oldName: roomToEdit.name,
            newName: values.name
        })).unwrap();

        router.push("/");
    };

    if (status === 'loading') return <div>{t.loading}</div>;
    if (!roomToEdit) return <div>{t.roomNotFound}</div>;

    return (
        <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
            <LanguageSwitcher />

            <h1 className="text-2xl font-bold mb-6 text-gray-700">{t.editRoom}: {roomToEdit.name}</h1>
            <div className="w-full max-w-md">
                <RoomForm
                    initialValues={{ name: roomToEdit.name }}
                    onSubmit={handleUpdate}
                    submitLabel={t.saveChanges}
                />
            </div>
        </main>
    );
}