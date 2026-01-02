"use client";

import { useEffect } from "react";
import RoomForm from "@/components/RoomForm";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchRooms, updateRoom } from "@/lib/features/rooms/roomsSlice";
import { useRouter, useParams } from "next/navigation";

export default function EditRoomPage() {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { items: rooms, status } = useAppSelector((state) => state.rooms);
    const roomToEdit = rooms.find((r) => r.id === Number(id));

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

    if (status === 'loading') return <div>Ładowanie...</div>;
    if (!roomToEdit) return <div>Nie znaleziono pokoju!</div>;

    return (
        <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Edytuj Pokój: {roomToEdit.name}</h1>
            <div className="w-full max-w-md">
                <RoomForm
                    initialValues={{ name: roomToEdit.name }}
                    onSubmit={handleUpdate}
                    submitLabel="Zapisz Zmiany"
                />
            </div>
        </main>
    );
}