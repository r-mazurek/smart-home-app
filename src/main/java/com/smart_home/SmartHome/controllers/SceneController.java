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
    public List<Scene> getAllScenes(){
        return new ArrayList<>(service.getScenes().values());
    }

    @GetMapping("/{sceneName}")
    public Scene getScene(@PathVariable("sceneName") String name){
        return service.getScene(name);
    }

    @GetMapping()
    public List<Scene> getScenesByName(@RequestParam("searchQuery") String searchQuery){
        return service.getScenesByName(searchQuery);
    }

    @PostMapping("/{sceneName}")
    public Scene createScene(@PathVariable String sceneName) {
        return service.createScene(sceneName);
    }

    @PutMapping("/{sceneName}")
    public boolean renameScene(@PathVariable String sceneName, @RequestParam String newName) {
        Scene scene = service.getScene(sceneName);

        return service.renameScene(scene.getId(), newName);
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
