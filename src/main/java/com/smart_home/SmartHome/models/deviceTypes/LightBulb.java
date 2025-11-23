package com.smart_home.SmartHome.models.deviceTypes;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Scene;

public class LightBulb extends Device {
    private float brightness;
    private String color;

    public LightBulb(long id, String name, float brightness) {
        super(id, name);
        this.brightness = brightness;
    }

    public LightBulb(long id, String name) {
        this(id, name, 1.0f);
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
