package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldRegisterUser_WhenNotExists() {
        when(userRepository.findByNameIgnoreCase("John")).thenReturn(null);

        User created = userService.registerUser("John", "secret");

        assertNotNull(created);
        assertEquals("John", created.getName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldNotRegisterUser_WhenExists() {
        when(userRepository.findByNameIgnoreCase("John")).thenReturn(new User("John", "pass"));

        User created = userService.registerUser("John", "newpass");

        assertNull(created);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldLoginUser_WithCorrectPassword() {
        User user = new User("Alice", "1234");
        when(userRepository.findByNameIgnoreCase("Alice")).thenReturn(user);

        boolean result = userService.loginUser("Alice", "1234");

        assertTrue(result);
    }

    @Test
    void shouldDeleteUser() {
        User user = new User("Bob", "pass");
        when(userRepository.findByNameIgnoreCase("Bob")).thenReturn(user);

        boolean deleted = userService.deleteUser("Bob");

        assertTrue(deleted);
        verify(userRepository).delete(user);
    }
}