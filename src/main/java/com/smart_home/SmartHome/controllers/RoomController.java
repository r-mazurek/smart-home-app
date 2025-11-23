package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Scene;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.models.deviceTypes.Thermostat;
import com.smart_home.SmartHome.services.RoomService;

import com.smart_home.SmartHome.services.SceneService;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService service;
    private final SceneService sceneService;

    public RoomController(RoomService service, SceneService sceneService) {
        this.service = service;
        this.sceneService = sceneService;

        // TEST DATA
        service.addRoom("kitchen", new Room());
    }

    @PostMapping("/{roomName}")
    public Room createRoom(@PathVariable String roomName) {
        if (service.getRoom(roomName) == null) {
            service.addRoom(roomName, new Room());
        }
        return service.getRoom(roomName);
    }

    @GetMapping()
    public Map<String, Room> getRooms() {
        return service.getRooms();
    }

    @GetMapping()
    public Map<String, Room> getRooms(@RequestParam String roomName) {
        return service.getRoomsByName(roomName);
    }

    @PutMapping("/{roomName}")
    public Room renameRoom(@PathVariable String roomName, @RequestParam String newName) {
        service.renameRoom(roomName, newName);
        return service.getRoom(newName);
    }

    @DeleteMapping("/{roomName}")
    public boolean deleteRoom(@PathVariable String roomName, @RequestParam boolean sure) {
        if(sure) {
            service.deleteRoom(roomName);
            return true;
        }
        return false;
    }

    // DEVICES
    @PutMapping("/{roomName}/devices")
    public Device createDevice(
            @PathVariable String roomName,
            @RequestParam String deviceType,
            @RequestParam String deviceName) {

        Room room = service.getRoom(roomName);

        if (room == null) return null;

        switch(deviceType) {
            case "lightBulb":
                LightBulb lightBulb = new LightBulb(service.getNextDeviceId(), deviceName);
                room.addDevice(lightBulb);
                return lightBulb;
            case "thermostat":
                Thermostat thermostat = new Thermostat(service.getNextDeviceId(),  deviceName);
                room.addDevice(thermostat);
                return thermostat;
            // other types will follow
            default:
                System.out.println("create device failed, wrong type selected");
                return null;
        }
    }

    @GetMapping("/{roomName}/devices")
    public List<Device> getRoomStatus( @PathVariable String roomName ) {
        Room room = service.getRoom(roomName);
        if (room == null) return Collections.emptyList();
        return room.getDevices();
    }

    @GetMapping("/{roomName}/devices")
    public List<Device> getDevicesByName(@PathVariable String roomName, @RequestParam String deviceName ) {
        Room room = service.getRoom(roomName);
        if (room == null) return Collections.emptyList();
        return room.getDevicesByName(deviceName);
    }

    @PostMapping("/{roomName}/devices/{deviceId}")
    public boolean toggleDevice(@PathVariable String roomName, @PathVariable long deviceId) {
        Room room = service.getRoom(roomName);
        if (room == null) return false;

        Device device = room.getDeviceById(deviceId);
        if (device == null) return false;

        device.toggle();
        return device.isOn();
    }

    @DeleteMapping("/{roomName}/devices/{deviceId}")
    public boolean deleteDevice(
            @PathVariable String roomName,
            @PathVariable long deviceId,
            @RequestParam boolean sure) {

        if  (sure) {
            Room room = service.getRoom(roomName);
            return room.deleteDevice(deviceId);
        }
        return false;
    }

    // SCENES

    @PutMapping("/{roomName}")
    public boolean applyScene(@PathVariable String roomName, @RequestParam String sceneName) {
        Room room = service.getRoom(roomName);
        Scene scene = sceneService.getScene(sceneName);
        if (room == null || scene == null) return false;
        room.applyScene(scene);
        return true;
    }
}
