import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room, PageResponse } from '@/types';

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
    async ({ page = 0, size = 4 }: { page?: number; size?: number } = {}) => {
        const response = await fetch(`http://localhost:8080/rooms?page=${page}&size=${size}&sortBy=name&direction=asc`);
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
            });
    },
});

export default roomsSlice.reducer;