import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './features/rooms/roomsSlice';
import devicesReducer from './features/devices/devicesSlice';
import statsReducer from './features/stats/statsSlice';
import logsReducer from "@/lib/features/logs/logsSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            rooms: roomsReducer,
            devices: devicesReducer,
            stats: statsReducer,
            logs: logsReducer,
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];