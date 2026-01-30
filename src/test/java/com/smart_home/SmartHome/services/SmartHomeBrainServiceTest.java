package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.*;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.models.deviceTypes.Thermostat;
import com.smart_home.SmartHome.repositories.EventLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SmartHomeBrainServiceTest {

    @Mock
    private WeatherService weatherService;

    @Mock
    private RoomService roomService;

    @Mock
    private EventLogRepository eventLogRepository;

    @InjectMocks
    private SmartHomeBrainService brainService;

    private Room testRoom;
    private Thermostat thermostat;
    private LightBulb lightBulb;

    @BeforeEach
    void setUp() {
        testRoom = new Room();
        testRoom.setName("Living Room");

        thermostat = new Thermostat("Main Heating", 18.0);
        thermostat.setRoom(testRoom);

        lightBulb = new LightBulb("Main Light", 1.0f);
        lightBulb.setRoom(testRoom);

        testRoom.addDevice(thermostat);
        testRoom.addDevice(lightBulb);
    }

    @Test
    void shouldTurnOnHeating_WhenColdOutsideAndInside() {
        // GIVEN
        WeatherDTO mockWeather = new WeatherDTO();
        WeatherDTO.CurrentWeather current = new WeatherDTO.CurrentWeather();
        current.setTemperature(5.0);
        current.setWindSpeed(10.0);
        mockWeather.setCurrentWeather(current);

        when(weatherService.getCurrentWeather()).thenReturn(mockWeather);
        when(roomService.getRoomsByName("")).thenReturn(List.of(testRoom));

        // WHEN
        brainService.automateHeating();

        // THEN
        assertEquals(22.0, thermostat.getTargetTemperature(), "Thermostat should be set to 22.0");
        assertTrue(thermostat.isOn(), "Thermostat should be turned ON");
        verify(eventLogRepository, times(1)).save(any(EventLog.class));
    }

    @Test
    void shouldNotTurnOnHeating_WhenWindIsTooStrong() {
        // GIVEN
        WeatherDTO mockWeather = new WeatherDTO();
        WeatherDTO.CurrentWeather current = new WeatherDTO.CurrentWeather();
        current.setTemperature(5.0);
        current.setWindSpeed(50.0);
        mockWeather.setCurrentWeather(current);

        when(weatherService.getCurrentWeather()).thenReturn(mockWeather);

        // WHEN
        brainService.automateHeating();

        // THEN
        verify(eventLogRepository, never()).save(any(EventLog.class));
    }

    @Test
    void shouldDimLights_WhenNightModeActive() {
        // GIVEN
        when(roomService.getRoomsByName("")).thenReturn(List.of(testRoom));
        LocalTime nightTime = LocalTime.of(23, 30);
        if (!lightBulb.isOn()) {
            lightBulb.toggle();
        }
        float bulbBrightnessBeforeNightMode = lightBulb.getBrightness();

        // WHEN
        brainService.activateNightMode(nightTime);

        // THEN
        assertTrue(lightBulb.getBrightness() < bulbBrightnessBeforeNightMode, "Light brightness should be reduced");
        verify(eventLogRepository, times(1)).save(any(EventLog.class));
    }

    @Test
    void shouldNotDimLights_DuringDay() {
        // GIVEN
        LocalTime dayTime = LocalTime.of(12, 00);

        // WHEN
        brainService.activateNightMode(dayTime);

        // THEN
        assertEquals(1.0f, lightBulb.getBrightness(), "Brightness should remain 100%");
        verify(eventLogRepository, never()).save(any(EventLog.class));
    }

    @Test
    void shouldTriggerAlarm_WhenNoUsersHomeAndDeviceTurnedOn() {
        // GIVEN
        List<User> usersAtHome = Collections.emptyList();
        Device hackedLight = new LightBulb("Hacked Light");
        hackedLight.setOn(true);

        // WHEN
        boolean isSafe = brainService.checkSecurity(usersAtHome, hackedLight);

        // THEN
        assertFalse(isSafe, "Security check should fail");
        verify(eventLogRepository, times(1)).save(argThat(log ->
                log.getMessage().contains("Unauthorised activity")
        ));
    }
}