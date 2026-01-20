import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface ChartData {
    name: string;
    value: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export const fetchStats = createAsyncThunk(
    'stats/fetchStats',
    async () => {
        const [roomRes, statusRes] = await Promise.all([
            fetch("http://localhost:8080/stats/devices-per-room"),
            fetch("http://localhost:8080/stats/devices-status")
        ]);

        if (!roomRes.ok || !statusRes.ok) {
            throw new Error("Failed to fetch statistics")
        }

        return {
            devicesPerRoom: (await roomRes.json()) as ChartData[],
            deviceStatus: (await statusRes.json()) as ChartData[],
        };
    }
);

interface StatsState {
    devicesPerRoom: ChartData[];
    deviceStatus: ChartData[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: StatsState = {
    devicesPerRoom: [],
    deviceStatus: [],
    status: 'idle',
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => { state.status = 'loading' })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.devicesPerRoom = action.payload.devicesPerRoom;
                state.deviceStatus = action.payload.deviceStatus;
            })
            .addCase(fetchStats.rejected, (state) => { state.status = 'failed'; });
    },
});

export default statsSlice.reducer;
