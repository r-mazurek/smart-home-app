export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

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

export interface WeatherData {
    current_weather: {
        temperature: number;
        windspeed: number;
        weathercode: number;
    }
}