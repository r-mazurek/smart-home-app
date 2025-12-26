package com.smart_home.SmartHome.models;

import jakarta.persistence.*;


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="device_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean isOn = false;

    protected Device() {}

    public Device(String name) {
        this.name = name;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isOn() { return isOn; }
    public void toggle() { isOn = !isOn; }
}

