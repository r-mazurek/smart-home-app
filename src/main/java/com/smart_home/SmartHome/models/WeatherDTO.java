package com.smart_home.SmartHome.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WeatherDTO {

    @JsonProperty("current_weather")
    private CurrentWeather currentWeather;

    public CurrentWeather getCurrentWeather() { return currentWeather; }
    public void setCurrentWeather(CurrentWeather currentWeather) { this.currentWeather = currentWeather; }

    public static class CurrentWeather {
        private double temperature;
        @JsonProperty("windspeed")
        private double windSpeed;

        public double getTemperature() { return temperature; }
        public void setTemperature(double temperature) { this.temperature = temperature; }
        public double getWindSpeed() { return windSpeed; }
        public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }
    }
}
