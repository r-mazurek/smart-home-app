package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.WeatherDTO;
import com.smart_home.SmartHome.services.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public WeatherDTO getWeather() {
        return weatherService.getCurrentWeather();
    }
}
