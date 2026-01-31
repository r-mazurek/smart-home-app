package com.smart_home.SmartHome.bdd.steps;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import com.smart_home.SmartHome.repositories.RoomRepository;
import com.smart_home.SmartHome.services.SmartHomeBrainService;
import io.cucumber.java.Before;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class NightModeSteps {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private SmartHomeBrainService brainService;

    @Before
    public void cleanDatabase() {
        deviceRepository.deleteAll();
        roomRepository.deleteAll();
    }

    @Given("a room named {string} exists")
    public void a_room_named_exists(String roomName) {
        if (roomRepository.findByNameIgnoreCase(roomName) == null) {
            Room room = new Room();
            room.setName(roomName);
            roomRepository.save(room);
        }
    }

    @Given("the room has a device named {string} which is a LightBulb")
    public void the_room_has_a_device_named_which_is_a_light_bulb(String deviceName) {
        Room room = roomRepository.findAll().get(0);
        LightBulb bulb = new LightBulb(deviceName, 1.0f);
        room.addDevice(bulb);
        deviceRepository.save(bulb);
        roomRepository.save(room);
    }

    @Given("the {string} is turned ON at {int}% brightness")
    public void the_device_is_turned_on_at_brightness(String deviceName, int percent) {
        Device device = deviceRepository.findByNameIgnoreCase(deviceName);
        if (device instanceof LightBulb bulb) {
            bulb.setOn(true);
            bulb.setBrightness(percent / 100.0f);
            deviceRepository.save(bulb);
        }
    }

    @When("the clock strikes {int}:{int}")
    @Transactional
    public void the_clock_strikes(int hour, int minute) {
        LocalTime time = LocalTime.of(hour, minute);
        brainService.activateNightMode(time);
    }

    @Then("the {string} brightness should be reduced by 25%")
    @Transactional
    public void the_device_brightness_should_be_reduced_to(String deviceName) {
        Device device = deviceRepository.findByNameIgnoreCase(deviceName);
        if (device instanceof LightBulb bulb) {
            assertEquals(0.75f, bulb.getBrightness(), 0.01f);
        }
    }
}