import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from './features/rooms/roomsSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            rooms: roomsReducer,
            // tutaj logs: logsReducer, weather: weatherReducer
        },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];