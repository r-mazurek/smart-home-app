package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.models.EventLog;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import com.smart_home.SmartHome.repositories.RoomRepository;
import com.smart_home.SmartHome.repositories.EventLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import com.smart_home.SmartHome.controllers.SseController;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;
    private final EventLogRepository eventLogRepository;
    private final SseController sseController;

    public RoomService(RoomRepository roomRepository,
                       DeviceRepository deviceRepository,
                       EventLogRepository eventLogRepository,
                       @Lazy SseController sseController) {
        this.roomRepository = roomRepository;
        this.deviceRepository = deviceRepository;
        this.eventLogRepository = eventLogRepository;
        this.sseController = sseController;
    }

    public Room getRoom(String name){
        return roomRepository.findByNameIgnoreCase(name);
    }

    public Page<Room> getRooms(Pageable pageable) {
        return roomRepository.findAll(pageable);
    }

    public List<Room> getRoomsByName(String searchQuery) {
        return roomRepository.findByNameContainingIgnoreCase(searchQuery);
    }

    public void addRoom(String name){
        Room room = new Room();
        room.setName(name);
        roomRepository.save(room);
    }

    public void updateRoom(Room room){
        roomRepository.save(room);
    }

    public Room renameRoom(String oldName, String newName){
        Room room = roomRepository.findByNameIgnoreCase(oldName);
        if (room != null) {
            room.setName(newName);
            return roomRepository.save(room);
        }
        return null;
    }

    public void deleteRoom(String roomName){
        Room room = roomRepository.findByNameIgnoreCase(roomName);
        roomRepository.delete(room);
    }

    @Transactional
    public boolean toggleDevice(String roomName, String deviceName){
        Room room = roomRepository.findByNameIgnoreCase(roomName);
        Device device = deviceRepository.findByNameIgnoreCase(deviceName);

        if(room != null && device != null){
            device.toggle();

            // log
            String status = device.isOn() ? "on" : "off";
            String msg = "Device " + deviceName + " in " + roomName + " has been switched " + status;
            eventLogRepository.save(new EventLog("DEVICE_ACTION", msg));
            EventLog savedLog = eventLogRepository.save(new EventLog("DEVICE_ACTION", msg));
            sseController.sendLogToClients(savedLog);

            return device.isOn();
        }
        return false;
    }

    @Transactional
    public void toggleDevice(Room room, Device device) {
        if (room != null && device != null) {

            // log
            String status = device.isOn() ? "on" : "off";
            String msg = "Device " + device.getName() + " in " + room.getName() + " has been switched " + status;
            eventLogRepository.save(new EventLog("DEVICE_ACTION", msg));
            EventLog savedLog = eventLogRepository.save(new EventLog("DEVICE_ACTION", msg));
            sseController.sendLogToClients(savedLog);

            device.toggle();
        }
    }

}
