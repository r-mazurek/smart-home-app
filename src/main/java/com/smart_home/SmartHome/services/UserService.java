package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private final Map<String, User> users = new HashMap<>();
    private long nextUserId = 1;

    public long getNextUserId() { return nextUserId++; }

    public List<User> getUsers() {
        return new ArrayList<User>(users.values());
    }

    public User getUser(String name) {
        if (name == null) return null;
        return users.get(name.toLowerCase());
    }

    public User getUser(long id) {
        return users.values().stream()
                .filter(u -> u.getId() == id)
                .findFirst()
                .orElse(null);
    }

    public User registerUser(String name, String password) {
        if (name == null) return null;

        String key = name.toLowerCase();
        if (users.containsKey(key)) {
            System.out.println("User already exists");
            return null;
        }

        User user = new User(getNextUserId(), name, password);
        users.put(key, user);
        return user;
    }

    public boolean loginUser(String name, String password) {
        User user = getUser(name);
        if (user == null) return false;
        return user.getPassword().equals(password);
    }

    public boolean renameUser(String name, String newName) {
        User user = getUser(name);
        if (user == null) return false;
        user.setName(newName);
        return true;
    }

    public boolean deleteUser(String name) {
        if (name == null || users.get(name) == null) return false;
        users.remove(name);
        return true;
    }
}
