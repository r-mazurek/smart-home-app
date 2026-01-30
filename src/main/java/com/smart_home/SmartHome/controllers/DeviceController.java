package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.EventLog;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import com.smart_home.SmartHome.repositories.EventLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devices")
public class DeviceController {
    private final DeviceRepository deviceRepository;
    private final SseController sseController;
    private final EventLogRepository eventLogRepository;

    public DeviceController(DeviceRepository deviceRepository, SseController sseController, EventLogRepository eventLogRepository) {
        this.deviceRepository = deviceRepository;
        this.sseController = sseController;
        this.eventLogRepository = eventLogRepository;
    }

    @GetMapping
    public Page<Device> getDevices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search
    ) {
        Sort.Direction sortDirection = direction.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        if (search != null) {
            return deviceRepository.findByNameContainingIgnoreCase(search, pageable);
        }

        return deviceRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDevice(@PathVariable Long id) {
        return deviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<Device> toggleDevice(@PathVariable long id) {
        return deviceRepository.findById(id)
                .map(device -> {
                    device.toggle();
                    sseController.sendLogToClients(new EventLog("DEVICE_TOGGLE", device.getName() + " (id: " + device.getId().toString() + ") has been toggled " + (device.isOn() ? "ON" : "OFF")));
                    deviceRepository.save(device);
                    eventLogRepository.save(new EventLog("DEVICE_TOGGLE", device.getName() + "has been toggled " + (device.isOn() ? "ON" : "OFF") + "."));
                    return ResponseEntity.ok(device);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Device> renameDevice(@PathVariable Long id, @RequestParam String name) {
        return deviceRepository.findById(id)
                .map(device -> {
                    device.setName(name);
                    return deviceRepository.save(device);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
