package com.smart_home.SmartHome.models.deviceTypes;

import com.smart_home.SmartHome.models.Device;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("thermostat")
public class Thermostat extends Device {
    private double temperature;
    private double targetTemperature;

    protected Thermostat() {}

    public Thermostat(String name, double temperature) {
        super(name);
        this.temperature = targetTemperature;
        this.targetTemperature = temperature;
    }

    public Thermostat(String name) {
        this(name, 21.0f);
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }
    public double getTemperature() {
        return temperature;
    }

    public void setTargetTemperature(double targetTemperature) {
        this.targetTemperature = targetTemperature;
    }
    public double getTargetTemperature() {
        return targetTemperature;
    }
}
