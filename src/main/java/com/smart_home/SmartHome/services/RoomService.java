package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Room;
import com.smart_home.SmartHome.repositories.DeviceRepository;
import com.smart_home.SmartHome.repositories.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final DeviceRepository deviceRepository;

    public RoomService(RoomRepository roomRepository, DeviceRepository deviceRepository) {
        this.roomRepository = roomRepository;
        this.deviceRepository = deviceRepository;
    }

    public Room getRoom(String name){
        return roomRepository.findByNameIgnoreCase(name);
    }

    public List<Room> getRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getRoomsByName(String searchQuery) {
        return roomRepository.findByNameContainingIgnoreCase(searchQuery);
    }

    public void addRoom(String name){
        Room room = new Room();
        room.setName(name);
        roomRepository.save(room);
    }

    public void renameRoom(String oldName, String newName){
        Room room = roomRepository.findByNameIgnoreCase(oldName);
        room.setName(newName);
        roomRepository.save(room);
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
            return device.isOn();
        }
        return false;
    }

    @Transactional
    public boolean toggleDevice(Room room, Device device){
        if(room != null && device != null){
            device.toggle();
            return device.isOn();
        }
        return false;
    }

}
