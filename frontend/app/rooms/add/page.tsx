"use client";

import RoomForm from "@/components/RoomForm";
import { useAppDispatch } from "@/lib/hooks";
import { addRoom } from "@/lib/features/rooms/roomsSlice";
import { useRouter } from "next/navigation";

export default function AddRoomPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleCreate = async (values: { name: string }) => {
        await dispatch(addRoom(values.name)).unwrap();

        router.push("/");
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">Dodaj Nowy Pokój</h1>
            <div className="w-full max-w-md">
                <RoomForm
                    initialValues={{ name: "" }}
                    onSubmit={handleCreate}
                    submitLabel="Utwórz Pokój"
                />
            </div>
            <button onClick={() => router.back()} className="mt-4 text-gray-500 hover:underline">
                Anuluj
            </button>
        </main>
    );
}