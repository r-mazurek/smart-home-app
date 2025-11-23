package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.Scene;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SceneService {
    private final Map<Long, Scene> scenes = new HashMap<>();
    private long nextSceneId = 1;

    public long getNextSceneId() { return nextSceneId++; }

    public Map<Long, Scene> getScenes() { return scenes; }

    public Scene getScene(long id) { return scenes.get(id); }
    public Scene getScene(String sceneName) {
        return scenes.values().stream()
                .filter(s -> s.getName().equalsIgnoreCase(sceneName))
                .findFirst().orElse(null);
    }

    public List<Scene> getScenesByName(String name) {
        return scenes.values().stream()
                .filter(scene -> scene.getName().equals(name))
                .toList();
    }


    public Scene createScene(String name) {
        Scene scene = new Scene(getNextSceneId(), name);
        scenes.put(scene.getId(), scene);
        return scene;
    }

    public boolean renameScene(long id, String newName) {
        Scene scene = scenes.get(id);
        if(scene == null) { return false; }
        scene.setName(newName);
        return true;
    }

    public boolean deleteScene(long id) {
        Scene scene = scenes.get(id);
        if(scene == null) { return false; }
        scenes.remove(id);
        return true;
    }
}
