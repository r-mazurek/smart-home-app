package com.smart_home.SmartHome.repositories;

import com.smart_home.SmartHome.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByNameContainingIgnoreCase(String name);
    Room findByNameIgnoreCase(String name);
    void deleteByNameIgnoreCase(String name);
}