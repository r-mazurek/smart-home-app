package com.smart_home.SmartHome.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Device> devices = new ArrayList<>();

    public Room() {}

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String newName) { this.name = newName; }

    public List<Device> getDevices() { return devices; }

    public void setDevices(List<Device> devices) {
        this.devices = devices;
    }

    public void addDevice(Device device) {
        device.setRoom(this);
        devices.add(device);
    }

    public List<Device> getDevicesByName(String nameQuery) {
        return devices.stream()
                .filter(device -> device.getName() != null && device.getName().contains(nameQuery))
                .collect(Collectors.toList());
    }

    public List<Device> getDevicesByType(String type) {
        return devices.stream()
                .filter(device -> device.getClass().getSimpleName().equalsIgnoreCase(type))
                .collect(Collectors.toList());
    }

    public Device getDeviceById(long id) {
        return devices.stream()
                .filter(d -> d.getId() != null && d.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public boolean deleteDevice(long deviceId) {
        Device device = getDeviceById(deviceId);
        return device != null && devices.remove(device);
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