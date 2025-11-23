package com.smart_home.SmartHome.models;

import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.models.deviceTypes.Thermostat;

import java.util.ArrayList;
import java.util.List;

public class Scene {
    private final long id;
    private String name;
    private final List<String> deviceTypeAffected;

    public Scene(long id, String name){
        this.id = id;
        this.name = name;
        this.deviceTypeAffected = new ArrayList<>();
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getDeviceTypeAffected() { return deviceTypeAffected; }
    public void addDeviceTypeAffected(String type){
        this.deviceTypeAffected.add(type.toLowerCase());
    }

    public void affectDevice(Device device) {
        switch (device) {
            case LightBulb bulb -> {
                if (!bulb.isOn()) { bulb.toggle(); }
                bulb.dim(0.2f);
            }
            case Thermostat thermostat -> {
                if (!thermostat.isOn()) { thermostat.toggle(); }
                if (thermostat.getTargetTemperature() < 20.0f){
                    thermostat.setTargetTemperature(
                            thermostat.getTargetTemperature() + 2.0f
                    );
                }
            }
            default ->
                System.out.println("Unknown type specified in Device.applyScene");
        }
    }
}
