package com.smart_home.SmartHome.models;

public abstract class Device {

    private final long id;
    private String name;
    private boolean isOn = false;

    public Device(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isOn() { return isOn; }
    public void toggle() { isOn = !isOn; }
}

