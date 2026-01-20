import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room, Device, PageResponse } from '@/types';
import { toggleDevice} from "@/lib/features/devices/devicesSlice";

interface RoomsState {
    items: Room[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalElements: number;
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RoomsState = {
    items: [],
    pagination: {
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
    },
    status: 'idle',
    error: null,
};

export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async ({
               page = 0,
               size = 5,
               sortBy = 'name',
               direction = 'asc',
               search = ''
           }: {
        page?: number;
        size?: number;
        sortBy?: string;
        direction?: string;
        search?: string; // Type def
    } = {}) => {

        const response = await fetch(
            `http://localhost:8080/rooms?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&search=${search}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        return (await response.json()) as PageResponse<Room>;
    }
);

export const addRoom = createAsyncThunk('rooms/addRoom', async (name: string) => {
    const response = await fetch(`http://localhost:8080/rooms/${name}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to create a new room')
    return (await response.json()) as Room
})

export const updateRoom = createAsyncThunk('rooms/updateRoom', async ({oldName, newName}: { oldName: string, newName: string}) => {
    const response = await fetch(`http://localhost:8080/rooms/${oldName}?newName=${newName}`, {
        method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to rename a room')
    return (await response.json()) as Room
})

export const addDeviceToRoom = createAsyncThunk(
    'rooms/addDeviceToRoom',
    async ({ roomName, deviceName, deviceType }: { roomName: string, deviceName: string, deviceType: string }) => {
        const response = await fetch(`http://localhost:8080/rooms/${roomName}/devices?deviceType=${deviceType}&deviceName=${deviceName}`, {
            method: 'POST',
        });

        if (!response.ok) throw new Error('Failed to add a new device')

        const newDevice = await response.json()
        return { roomName, newDevice };
    }
);

export const deleteRoom = createAsyncThunk(
    'rooms/deleteRoom',
    async (name: string) => {
        await fetch(`http://localhost:8080/rooms/${name}?sure=true`,
        {method: "DELETE" });
        return name;
    }
);

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        // zwykle akcje synchroniczne
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;

                state.pagination = {
                    currentPage: action.payload.number,
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements
                };
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            })
            .addCase(addRoom.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateRoom.fulfilled, (state, action) => {
                console.log("Payload: " + action.payload)
                const index = state.items.findIndex((r) => r.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(addDeviceToRoom.fulfilled, (state, action) => {
                const { roomName, newDevice } = action.payload;
                const room = state.items.find(r => r.name === roomName);
                if (room) {
                    room.devices.push(newDevice as Device);
                }
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.items = state.items.filter(room => room.name !== action.payload);
            })
            .addCase(toggleDevice.fulfilled, (state, action) => {
                const updatedDevice = action.payload;

                for (let i = 0; i < state.items.length; i++) {
                    const room = state.items[i];

                    if (!room.devices || !Array.isArray(room.devices)) continue;

                    const deviceIndex = room.devices.findIndex(d => d.id === updatedDevice.id);

                    if (deviceIndex !== -1) {
                        state.items[i].devices[deviceIndex].isOn = updatedDevice.isOn;

                        if (updatedDevice.temperature !== undefined) {
                            state.items[i].devices[deviceIndex].temperature = updatedDevice.temperature;
                        }

                        break;
                    }
                }
            });
    },
});

export default roomsSlice.reducer;