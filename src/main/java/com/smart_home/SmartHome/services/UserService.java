package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.models.User.Role;
import com.smart_home.SmartHome.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(String name) {
        return userRepository.findByNameIgnoreCase(name);
    }

    public User registerUser(String name, String password, String roleName) {
        Role role;
        try {
            role = Role.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            role = Role.USER;
        }
        return registerUser(name, password, role);
    }

    @Transactional
    public User registerUser(String name, String password, Role role) {
        if (userRepository.findByNameIgnoreCase(name) != null) {
            return null;
        }

        String hashedPassword = passwordEncoder.encode(password);

        User user = new User(name, hashedPassword, role);
        return userRepository.save(user);
    }

    public boolean loginUser(String name, String rawPassword) {
        User user = getUser(name);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public boolean checkPassword(String name, String password) {
        return loginUser(name, password);
    }

    @Transactional
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