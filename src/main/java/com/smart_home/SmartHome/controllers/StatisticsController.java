package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import com.smart_home.SmartHome.repositories.RoomRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/stats")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StatisticsController {
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;

    public StatisticsController(RoomRepository roomRepository, DeviceRepository deviceRepository) {
        this.roomRepository = roomRepository;
        this.deviceRepository = deviceRepository;
    }

    // liczba urzadzen w pokoju
    @GetMapping("/devices-per-room")
    public List<Map<String, Object>> getDevicesPerRoom() {
        return roomRepository.findAll().stream()
                .map(room -> Map.<String, Object>of(
                        "name", room.getName(),
                        "value", room.getDevices().size()
                ))
                .collect(Collectors.toList());
    }

    // urzadzenia wlaczone vs wylaczone
    @GetMapping("/devices-status")
    public List<Map<String, Object>> getDeviceStatus() {
        long onCount = deviceRepository.findAll().stream()
                .filter(Device::isOn)
                .count();
        long offCount = deviceRepository.count() - onCount;

        return List.of(
                Map.of("name", "ON", "value", onCount),
                Map.of("name", "OFF", "value", offCount)
        );
    }
}
