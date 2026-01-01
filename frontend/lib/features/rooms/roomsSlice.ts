import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '@/types';

interface RoomsState {
    items: Room[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RoomsState = {
    items: [],
    status: 'idle',
    error: null,
};

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
    const response = await fetch('http://localhost:8080/rooms');
    if (!response.ok) {
        throw new Error('Failed to fetch rooms');
    }
    return (await response.json()) as Room[];
});

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
                state.items = Array.isArray(action.payload) ? action.payload : Object.values(action.payload);
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export default roomsSlice.reducer;