package com.smart_home.SmartHome.models.deviceTypes;

import com.smart_home.SmartHome.models.Device;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("thermostat")
public class Thermostat extends Device {
    private float targetTemperature;

    protected Thermostat() {}

    public Thermostat(String name, float targetTemperature) {
        super(name);
        this.targetTemperature = targetTemperature;
    }

    public Thermostat(String name) {
        this(name, 21.0f);
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
