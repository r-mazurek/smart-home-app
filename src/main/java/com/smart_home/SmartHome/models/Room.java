package com.smart_home.SmartHome.models;

import com.smart_home.SmartHome.models.Device;
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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private final List<Device> devices = new ArrayList<>();

    public Room() {}

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", devices=" + devices +
                '}';
    }

    public void setName(String newName) {
        this.name = newName;
    }

    public String  getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public void setDevices(List<Device> devices) {}

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