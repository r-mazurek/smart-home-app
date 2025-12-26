export interface Device {
    id: number;
    name: string;
    isOn: boolean;
    deviceType?: string;
}

export interface Room {
    id: number;
    name: string;
    devices: Device[];
}

export interface EventLog {
    id: number;
    eventType: string;
    message: string;
    timestamp: string;
}