package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Scene;
import com.smart_home.SmartHome.repositories.SceneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SceneService {
    private final SceneRepository sceneRepository;

    public SceneService(SceneRepository sceneRepository) {
        this.sceneRepository = sceneRepository;
    }

    public List<Scene> getScenes() { return sceneRepository.findAll(); }

    public Scene getScene(String sceneName) {
        return sceneRepository.findByNameIgnoreCase(sceneName);
    }

    public List<Scene> getScenesByName(String name) {
        return sceneRepository.findByNameContainingIgnoreCase(name);
    }

    public Scene createScene(String name) {
        Scene scene = new Scene(name);
        sceneRepository.save(scene);
        return scene;
    }

    public void renameScene(long id, String newName) {
        Scene scene = sceneRepository.findById(id).orElse(null);
        if (scene != null) {
            scene.setName(newName);
            sceneRepository.save(scene);
        }
    }

    public boolean deleteScene(long id) {
        if (sceneRepository.existsById(id)) {
            sceneRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
