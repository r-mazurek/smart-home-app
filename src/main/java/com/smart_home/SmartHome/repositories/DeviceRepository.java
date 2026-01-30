package com.smart_home.SmartHome.repositories;

import com.smart_home.SmartHome.models.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository  extends JpaRepository<Device, Long> {
    Device findByNameIgnoreCase(String deviceName);
    Page<Device> findByNameContainingIgnoreCase(String deviceName, Pageable pageable);
    void deleteByNameIgnoreCase(String deviceName);
    void delete(Device device);
}
