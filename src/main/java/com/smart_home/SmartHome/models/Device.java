package com.smart_home.SmartHome.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;


@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="device_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @JsonProperty("isOn")
    private boolean isOn = false;

    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonIgnoreProperties("devices")
    private Room room;

    protected Device() {}

    public Device(String name) {
        this.name = name;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isOn() { return isOn; }
    public void toggle() { isOn = !isOn; }
    public void setOn(boolean on) { this.isOn = on; }

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }

    @Transient
    public String getDeviceType() {
        return this.getClass().getSimpleName();
    }

}

