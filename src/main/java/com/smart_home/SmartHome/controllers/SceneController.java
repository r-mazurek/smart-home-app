package com.smart_home.SmartHome.controllers;


import com.smart_home.SmartHome.models.Scene;
import com.smart_home.SmartHome.services.SceneService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/scenes")
public class SceneController {
    private final SceneService service;

    public SceneController(SceneService service) {
        this.service = service;
    }

    @GetMapping
    public List<Scene> getAllScenes(@RequestParam(required = false) String searchQuery){
        if(searchQuery != null) {
            return service.getScenesByName(searchQuery);
        } else return service.getScenes();
    }

    @GetMapping("/{sceneName}")
    public Scene getScene(@PathVariable("sceneName") String name){
        return service.getScene(name);
    }

    @PostMapping("/{sceneName}")
    public Scene createScene(@PathVariable String sceneName) {
        return service.createScene(sceneName);
    }

    @PutMapping("/{sceneName}")
    public boolean renameScene(@PathVariable String sceneName, @RequestParam String newName) {
        Scene scene = service.getScene(sceneName);

        service.renameScene(scene.getId(), newName);
        return true;
    }

    @DeleteMapping("/{sceneName}")
    public boolean deleteScene(@PathVariable String sceneName, @RequestParam boolean sure) {
        if(sure) {
            Scene scene = service.getScene(sceneName);

            return service.deleteScene(scene.getId());
        }
        return false;
    }

}
