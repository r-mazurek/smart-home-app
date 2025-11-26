package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;

        // TEST DATA
        service.registerUser("TestUser", "TestPassword");
    }

    @GetMapping()
    public List<User> getUsers() {
        return service.getUsers();
    }

    @GetMapping("/{userName}")
    public User getUser(@PathVariable String userName) {
        return service.getUser(userName);
    }

    @PostMapping("/{userName}")
    public User createUser(@PathVariable String userName, @RequestParam String password) {
        return service.registerUser(userName, password);
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        if(service.loginUser(username, password)) {
            return "Login success";
        }
        return "Login failed";
    }

    @PutMapping("/{userName}")
    public boolean renameUser(@PathVariable String userName, @RequestParam String newName) {
        return service.renameUser(userName, newName);
    }

    @DeleteMapping("/{userName}")
    public boolean deleteUser(@PathVariable String userName, @RequestParam boolean sure) {
        if(sure) {
            return service.deleteUser(userName);
        }
        return false;
    }

}
