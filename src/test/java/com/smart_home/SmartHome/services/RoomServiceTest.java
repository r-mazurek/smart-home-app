package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.controllers.SseController;
import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.EventLog;
import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.models.deviceTypes.LightBulb;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import com.smart_home.SmartHome.repositories.EventLogRepository;
import com.smart_home.SmartHome.repositories.RoomRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock private RoomRepository roomRepository;
    @Mock private DeviceRepository deviceRepository;
    @Mock private EventLogRepository eventLogRepository;
    @Mock private SseController sseController;

    @InjectMocks
    private RoomService roomService;

    @Test
    void shouldAddRoom() {
        roomService.addRoom("Kitchen");
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void shouldToggleDevice_WhenExists() {
        // GIVEN
        Room room = new Room();
        room.setName("LivingRoom");

        LightBulb bulb = new LightBulb("Lamp");
        bulb.setRoom(room);
        bulb.setOn(false);

        when(roomRepository.findByNameIgnoreCase("LivingRoom")).thenReturn(room);
        when(deviceRepository.findByNameIgnoreCase("Lamp")).thenReturn(bulb);

        // WHEN
        boolean result = roomService.toggleDevice("LivingRoom", "Lamp");

        // THEN
        assertTrue(result);
        assertTrue(bulb.isOn());
        verify(eventLogRepository, atLeastOnce()).save(any(EventLog.class));
    }

    @Test
    void shouldRenameRoom() {
        Room room = new Room();
        room.setName("OldName");
        when(roomRepository.findByNameIgnoreCase("OldName")).thenReturn(room);

        roomService.renameRoom("OldName", "NewName");

        assertEquals("NewName", room.getName());
        verify(roomRepository).save(room);
    }
}