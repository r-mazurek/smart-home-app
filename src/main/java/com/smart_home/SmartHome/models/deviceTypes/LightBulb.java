package com.smart_home.SmartHome.models.deviceTypes;

import com.smart_home.SmartHome.models.Device;

public class LightBulb extends Device {
    private float brightness;

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
}
