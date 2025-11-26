package com.smart_home.SmartHome.repositories;

import com.smart_home.SmartHome.models.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository  extends JpaRepository<Device, Long> {
    Device findByNameIgnoreCase(String deviceName);
    List<Device> findByNameContainingIgnoreCase(String deviceName);
    void deleteByNameIgnoreCase(String deviceName);
    void delete(Device device);
}
