"use client";

import RoomForm from "@/components/RoomForm";
import { useAppDispatch } from "@/lib/hooks";
import { addRoom } from "@/lib/features/rooms/roomsSlice";
import { useRouter } from "next/navigation";
import {useLanguage} from "@/context/LanguageContext";
import languageSwitcher from "@/components/LanguageSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AddRoomPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { t } = useLanguage();

    const handleCreate = async (values: { name: string }) => {
        await dispatch(addRoom(values.name)).unwrap();

        router.push("/");
    };

    return (
        <main className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
            <LanguageSwitcher />

            <h1 className="text-2xl font-bold mb-6">{t.addRoom}</h1>
            <div className="w-full max-w-md">
                <RoomForm
                    initialValues={{ name: "" }}
                    onSubmit={handleCreate}
                    submitLabel={t.createRoom}
                />
            </div>
            <button onClick={() => router.back()} className="mt-4 text-gray-500 hover:underline">
                {t.cancel}
            </button>
        </main>
    );
}