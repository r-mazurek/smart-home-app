package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.User;
import com.smart_home.SmartHome.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldRegisterUser_WhenNotExists() {
        String rawPassword = "secret";
        String encodedPassword = "encoded_secret";

        when(userRepository.findByNameIgnoreCase("John")).thenReturn(null);
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User created = userService.registerUser("John", rawPassword, User.Role.USER);

        assertNotNull(created);
        assertEquals("John", created.getName());
        assertEquals(encodedPassword, created.getPassword());
        assertEquals(User.Role.USER, created.getRole());

        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldNotRegisterUser_WhenExists() {
        when(userRepository.findByNameIgnoreCase("John"))
                .thenReturn(new User("John", "somePass", User.Role.USER));

        User created = userService.registerUser("John", "newpass", User.Role.USER);

        assertNull(created);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void shouldLoginUser_WithCorrectPassword() {
        String rawPassword = "1234";
        String dbHash = "hashed_1234";

        User user = new User("Alice", dbHash, User.Role.USER);

        when(userRepository.findByNameIgnoreCase("Alice")).thenReturn(user);
        when(passwordEncoder.matches(rawPassword, dbHash)).thenReturn(true);

        boolean result = userService.loginUser("Alice", rawPassword);

        assertTrue(result);
        verify(passwordEncoder).matches(rawPassword, dbHash);
    }

    @Test
    void shouldNotLoginUser_WithWrongPassword() {
        String rawPassword = "wrong";
        String dbHash = "hashed_1234";

        User user = new User("Alice", dbHash, User.Role.USER);

        when(userRepository.findByNameIgnoreCase("Alice")).thenReturn(user);
        when(passwordEncoder.matches(rawPassword, dbHash)).thenReturn(false);

        boolean result = userService.loginUser("Alice", rawPassword);

        assertFalse(result);
    }

    @Test
    void shouldDeleteUser() {
        User user = new User("Bob", "pass", User.Role.USER);
        when(userRepository.findByNameIgnoreCase("Bob")).thenReturn(user);

        boolean deleted = userService.deleteUser("Bob");

        assertTrue(deleted);
        verify(userRepository).delete(user);
    }
}