package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.models.User.Role;
import com.smart_home.SmartHome.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;

        // TEST DATA
        service.registerUser("TestUser", "TestPassword", Role.ADMIN);
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
    public User createUser(@PathVariable String userName, @RequestParam String password, @RequestParam String role) {
        return service.registerUser(userName, password, role);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password, HttpServletResponse response) {
        if (service.checkPassword(username, password)) {
            Cookie cookie = new Cookie("user_session", username);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);
            response.addCookie(cookie);
            return ResponseEntity.ok("Login success");
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("user_session", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
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
