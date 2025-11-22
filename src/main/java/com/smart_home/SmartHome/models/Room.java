package com.smart_home.SmartHome.models;

import com.smart_home.SmartHome.models.Device;

import java.util.ArrayList;
import java.util.List;

public class Room {
    private final List<Device> devices = new ArrayList<>();

    public void addDevice(Device device) {
        devices.add(device);
    }

    public List<Device> getDevices() {
        return devices;
    }

    public Device getDeviceById(long id) {
        for (Device d : devices) {
            if (d.getId() == id) {
                return d;
            }
        }
        return null;
    }

    public boolean deleteDevice(long deviceId) {
        Device device = getDeviceById(deviceId);
        return devices.remove(device);
    }
}