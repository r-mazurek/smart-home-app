package com.smart_home.SmartHome.models.deviceTypes;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Scene;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("light_bulb")
public class LightBulb extends Device {
    private float brightness;
    private String color;

    protected LightBulb() {}

    public LightBulb(String name, float brightness) {
        super(name);
        this.brightness = brightness;
    }

    public LightBulb(String name) {
        this(name, 1.0f);
    }

    public float getBrightness() {
        return brightness;
    }

    public boolean setBrightness(float brightness) {
        if (brightness < 0.0f || brightness > 1.0f) { return false; }
        this.brightness = brightness;
        return true;
    }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public boolean dim(float byPercent) {
        if (byPercent < 0.0f || byPercent > 1.0f) { return false; }
        brightness -= brightness * byPercent;
        return true;
    }
}
