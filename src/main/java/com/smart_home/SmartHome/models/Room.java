package com.smart_home.SmartHome.models;

import com.smart_home.SmartHome.models.Device;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Room {
    private final List<Device> devices = new ArrayList<>();

    public void addDevice(Device device) {
        devices.add(device);
    }

    public List<Device> getDevices() {
        return devices;
    }

    public List<Device> getDevicesByName(String nameQuery) {
        return devices.stream()
                .filter(device -> device.getName().contains(nameQuery))
                .collect(Collectors.toList());
    }

    public List<Device> getDevicesByType(String type) {
        return devices.stream()
                .filter(device -> device.getClass().getSimpleName().equalsIgnoreCase(type))
                .collect(Collectors.toList());
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

    public void applyScene(Scene scene) {
        for (String deviceType : scene.getDeviceTypeAffected()) {
            List<Device> devicesAffected = getDevicesByType(deviceType);

            for (Device device : devicesAffected) {
                scene.affectDevice(device);
            }
        }
    }
}