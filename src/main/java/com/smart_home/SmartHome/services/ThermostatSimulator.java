package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.deviceTypes.Thermostat;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ThermostatSimulator {
    private final DeviceRepository deviceRepository;
    private final Random random = new Random();

    public ThermostatSimulator(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Scheduled(fixedRate = 5000)
    public void simulateTemperature() {
        List<Device> devices = deviceRepository.findAll();

        for (Device device : devices) {
            if (device instanceof Thermostat thermostat) {
                double newTemp = 19.0 + (random.nextDouble() * 5.0);
                newTemp = Math.round(newTemp * 10.0) / 10.0;

                thermostat.setTemperature(newTemp);
                deviceRepository.save(thermostat);
            }
        }
    }
}
