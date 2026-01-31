package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Scene;
import com.smart_home.SmartHome.repositories.SceneRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SceneServiceTest {

    @Mock
    private SceneRepository sceneRepository;

    @InjectMocks
    private SceneService sceneService;

    @Test
    void shouldCreateScene() {
        Scene created = sceneService.createScene("Cinema");

        assertNotNull(created);
        assertEquals("Cinema", created.getName());
        verify(sceneRepository).save(any(Scene.class));
    }

    @Test
    void shouldRenameScene() {
        Scene scene = new Scene("OldName");
        when(sceneRepository.findById(1L)).thenReturn(Optional.of(scene));

        sceneService.renameScene(1L, "NewName");

        assertEquals("NewName", scene.getName());
        verify(sceneRepository).save(scene);
    }

    @Test
    void shouldDeleteScene_WhenExists() {
        when(sceneRepository.existsById(1L)).thenReturn(true);

        boolean result = sceneService.deleteScene(1L);

        assertTrue(result);
        verify(sceneRepository).deleteById(1L);
    }
}