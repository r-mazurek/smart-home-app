package com.smart_home.SmartHome.models.deviceTypes;

import com.smart_home.SmartHome.models.Device;

public class Thermostat extends Device {
    private float targetTemperature;

    public Thermostat(long id, String name, float targetTemperature) {
        super(id, name);
        this.targetTemperature = targetTemperature;
    }

    public Thermostat(long id, String name) {
        this(id, name, 21.0f);
    }

    public float getTargetTemperature() {
        return targetTemperature;
    }

    public boolean setTargetTemperature(float targetTemperature) {
        if (targetTemperature < 16.0f || targetTemperature > 26.0f) return false;

        this.targetTemperature = targetTemperature;
        return true;
    }
}
