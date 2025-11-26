package com.smart_home.SmartHome.repositories;

import com.smart_home.SmartHome.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByNameContainingIgnoreCase(String name);
    User findByNameIgnoreCase(String name);
    void deleteByNameIgnoreCase(String name);
    void delete(User user);
}
