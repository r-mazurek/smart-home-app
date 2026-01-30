package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.EventLog;
import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.models.WeatherDTO;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.models.deviceTypes.Thermostat;
import com.smart_home.SmartHome.repositories.EventLogRepository;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class SmartHomeBrainService {
    private final WeatherService weatherService;
    private final RoomService roomService;
    private final EventLogRepository eventLogRepository;

    public SmartHomeBrainService(WeatherService weatherService, RoomService roomService, EventLogRepository eventLogRepository) {
        this.weatherService = weatherService;
        this.roomService = roomService;
        this.eventLogRepository = eventLogRepository;
    }

    public void automateHeating() {
        WeatherDTO weather = weatherService.getCurrentWeather();
        if (weather == null || weather.getCurrentWeather() == null) return;

        double outdoorTemp = weather.getCurrentWeather().getTemperature();
        double windSpeed = weather.getCurrentWeather().getWindSpeed();

        if (outdoorTemp < 15.0) {
            if (windSpeed < 30.0) {
                List<Device> devices = roomService.getRoomsByName("").stream()
                        .flatMap(room -> room.getDevices().stream())
                        .toList();

                for (Device device : devices) {
                    if (device instanceof Thermostat t) {
                        if (t.getTemperature() < 20.0) {
                            t.setTargetTemperature(22.0);
                            t.setOn(true);
                            eventLogRepository.save(new EventLog("AUTO_HEATING", "Heating enabled for " + t.getName()));
                        }
                    }
                }
            }
        }
    }

    public void activateNightMode(LocalTime localTime) {
        if (localTime.isAfter(LocalTime.of(22, 0)) || localTime.isBefore(LocalTime.of(6, 0))) {
            List<Device> devices = roomService.getRoomsByName("").stream()
                    .flatMap(room -> room.getDevices().stream())
                    .toList();

            for (Device device : devices) {
                if (device instanceof LightBulb lightBulb) {
                    if (lightBulb.isOn()) {
                        lightBulb.dim(25);
                        eventLogRepository.save(new EventLog("NIGHT_MODE", "Dimmed light: " + lightBulb.getName()));
                    }
                }
            }
        }
    }

    public boolean checkSecurity(List<User> usersAtHome, Device deviceChanged) {
        if (usersAtHome.isEmpty()) {
            if (deviceChanged.isOn()) {
                eventLogRepository.save(new EventLog("SECURITY_ALERT", "Unauthorised activity detected: " + deviceChanged.getName()));
                return false;
            }
        }
        return true;
    }

}
