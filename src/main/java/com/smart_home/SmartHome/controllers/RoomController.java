package com.smart_home.SmartHome.controllers;


import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.services.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;

        service.addRoom("kitchen", new Room());
    }

    @PostMapping("/create")
    public Room createRoom(@RequestParam String name) {
        service.addRoom(name, new Room());
        return service.getRoom(name);
    }

    @GetMapping()
    public Map<String, Room> getRooms() {
        return service.getRooms();
    }

    @PutMapping("/{roomName}/rename")
    public Room renameRoom(@PathVariable String roomName, @RequestParam String newName) {
        service.renameRoom(roomName, newName);
        return service.getRoom(newName);
    }

    @DeleteMapping("/{roomName}/delete")
    public boolean deleteRoom(@PathVariable String roomName, @RequestParam boolean sure) {
        if(sure) {
            service.deleteRoom(roomName);
            return true;
        }
        return false;
    }

    // DEVICES
    @PutMapping("/{roomName}/devices/add/lightbulb")
    public LightBulb createLightBulb(@PathVariable String roomName, @RequestParam String lightBulbName) {
        LightBulb lightBulb = new LightBulb(service.getNextDeviceId(), lightBulbName);
        Room room = service.getRoom(roomName);

        room.addDevice(lightBulb);

        return lightBulb;
    }

    @GetMapping("/{roomName}/devices")
    public List<Device> getRoomStatus( @PathVariable String roomName ) {
        Room room = service.getRoom(roomName);
        if (room == null) return Collections.emptyList();
        return room.getDevices();
    }

    @PostMapping("/{roomName}/devices/{deviceId}/toggle")
    public boolean toggleDevice(@PathVariable String roomName, @PathVariable long deviceId) {
        Room room = service.getRoom(roomName);
        if (room == null) return false;

        Device device = room.getDeviceById(deviceId);
        if (device == null) return false;

        device.toggle();
        return device.isOn();
    }

    @DeleteMapping("/{roomName}/devices/{deviceId}/delete")
    public boolean deleteDevice(@PathVariable String roomName, @PathVariable long deviceId, @RequestParam boolean sure) {
        if  (sure) {
            Room room = service.getRoom(roomName);
            return room.deleteDevice(deviceId);
        }
        return false;
    }
}
