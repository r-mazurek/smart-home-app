package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Scene;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.models.deviceTypes.Thermostat;
import com.smart_home.SmartHome.services.RoomService;

import com.smart_home.SmartHome.services.SceneService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/rooms")
public class RoomController {
    private final RoomService service;
    private final SceneService sceneService;

    public RoomController(RoomService service, SceneService sceneService) {
        this.service = service;
        this.sceneService = sceneService;

        // TEST DATA
        service.addRoom("kitchen");
    }

    @PostMapping("/{roomName}")
    public Room createRoom(@PathVariable String roomName) {
        if (service.getRoom(roomName) == null) {
            service.addRoom(roomName);
        }
        return service.getRoom(roomName);
    }

    @GetMapping
    public Page<Room> getRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        return service.getRooms(pageable);
    }

    @PutMapping("/{roomName}")
    public Room renameRoom(@PathVariable String roomName, @RequestParam String newName) {
        return service.renameRoom(roomName, newName);
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
    @PostMapping("/{roomName}/devices")
    public Device createDevice(
            @PathVariable String roomName,
            @RequestParam String deviceType,
            @RequestParam String deviceName) {

        Room room = service.getRoom(roomName);

        if (room == null) return null;

        Device newDevice = null;

        switch(deviceType) {
            case "lightBulb":
                newDevice = new LightBulb(deviceName);
                break;
            case "thermostat":
                newDevice = new Thermostat(deviceName);
                break;
            // other types will follow
            default:
                System.out.println("create device failed, wrong type selected");
                return null;
        }

        room.addDevice(newDevice);
        service.updateRoom(room);
        return newDevice;
    }

    @GetMapping("/{roomName}/devices")
    public List<Device> getRoomStatus( @PathVariable String roomName, @RequestParam(required = false) String deviceName ) {
        Room room = service.getRoom(roomName);
        if (room == null) return Collections.emptyList();
        if (deviceName != null) {
            return room.getDevicesByName(deviceName);
        } else return room.getDevices();
    }

    @PostMapping("/{roomName}/devices/{deviceId}")
    public boolean toggleDevice(@PathVariable String roomName, @PathVariable long deviceId) {
        Room room = service.getRoom(roomName);
        if (room == null) return false;

        Device device = room.getDeviceById(deviceId);
        if (device == null) return false;

        service.toggleDevice(room, device);
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

    @PutMapping("/{roomName}/scenes")
    public boolean applyScene(@PathVariable String roomName, @RequestParam String sceneName) {
        Room room = service.getRoom(roomName);
        Scene scene = sceneService.getScene(sceneName);
        if (room == null || scene == null) return false;
        room.applyScene(scene);
        return true;
    }
}
