package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(String name) {
        return userRepository.findByNameIgnoreCase(name);
    }

    public User getUser(long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User registerUser(String name, String password) {
        if (name == null) return null;

        if (userRepository.findByNameIgnoreCase(name) != null) {
            System.out.println("User already exists");
            return null;
        }

        User user = new User(name, password);
        userRepository.save(user);
        return user;
    }

    public boolean loginUser(String name, String password) {
        User user = getUser(name);
        if (user == null) return false;
        return user.getPassword().equals(password);
    }

    public boolean renameUser(String name, String newName) {
        User user = userRepository.findByNameIgnoreCase(name);
        if (user == null) return false;
        user.setName(newName);
        userRepository.save(user);
        return true;
    }

    public boolean deleteUser(String name) {
        if (name == null) return false;
        User user = userRepository.findByNameIgnoreCase(name);
        if (user == null) return false;
        userRepository.delete(user);
        return true;
    }
}
