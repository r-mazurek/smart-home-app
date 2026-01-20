import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {EventLog} from "@/types";

interface LogsState {
    items: EventLog[];
}

const initialState: LogsState = {
    items: [],
};

const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {
        addLog: (state, action: PayloadAction<EventLog>) => {
            state.items.unshift(action.payload);
            if (state.items.length > 50) {
                state.items.pop()
            }
        },
        ckearLogs: (state) => {
            state.items = [];
        }
    },
});

export const { addLog, ckearLogs } = logsSlice.actions;
export default logsSlice.reducer;