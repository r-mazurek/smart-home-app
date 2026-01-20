import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Device, PageResponse } from '@/types';

export const fetchDevices = createAsyncThunk(
    'devices/fetchDevices',
    async ({
               page = 0,
               size = 10,
               search = "",
               sortBy = "name",
               direction = "asc"
    }: {page?: number;
        size?: number;
        search?: string;
        sortBy?: string;
        direction?: string;} = {}) => {

        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy: sortBy.toString(),
            direction: direction.toString(),
        });

        if (search) {
            params.append("search", search)
        }

        const response = await fetch(`http://localhost:8080/devices?${params.toString()}`);

        if (!response.ok) throw new Error('Failed to fetch devices');
        return (await response.json()) as PageResponse<Device>;
    }
);

export const toggleDevice = createAsyncThunk(
    'devices/toggleDevice',
    async (id: number) => {
        const response = await fetch(`http://localhost:8080/devices/${id}/toggle`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error("Failed to toggle device");
        return (await response.json()) as Device;
    }
);

interface DevicesState {
    items: Device[];
    pagination: { currentPage: number, totalPages: number, totalElements: number };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DevicesState = {
    items: [],
    pagination: { currentPage: 0, totalPages: 0, totalElements: 0 },
    status: 'idle',
};

const devicesSlice = createSlice({
    name: 'devices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDevices.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchDevices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.content;
                state.pagination = {
                    currentPage: action.payload.number,
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements
                };
            })
            .addCase(fetchDevices.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(toggleDevice.fulfilled, (state, action) => {
                const index = state.items.findIndex(d => d.id === action.payload.id);
                if (index != -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export default devicesSlice.reducer;