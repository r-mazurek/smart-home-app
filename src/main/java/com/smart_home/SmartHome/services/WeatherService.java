package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.WeatherDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {
    private final String API_URL = "https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current_weather=true";

    public WeatherDTO getCurrentWeather() {
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(API_URL, WeatherDTO.class);
    }

}
