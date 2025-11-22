package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Device;
import com.smart_home.SmartHome.models.Room;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RoomService {
    private final Map<String, Room> rooms = new HashMap<>();
    private long nextDeviceId = 1;

    public Room getRoom(String name){
        return rooms.get(name.toLowerCase());
    }

    public Map<String, Room> getRooms() {
        return rooms;
    }

    public void addRoom(String name, Room room){
        rooms.put(name.toLowerCase(), room);
    }

    public boolean renameRoom(String oldName, String newName){
        Room room = rooms.get(oldName.toLowerCase());
        if(room == null) return false;
        rooms.remove(oldName.toLowerCase());
        rooms.put(newName.toLowerCase(), room);
        return true;
    }

    public boolean deleteRoom(String roomName){
        return rooms.remove(roomName.toLowerCase()) != null;
    }

    public long getNextDeviceId() { return nextDeviceId++; }

}
