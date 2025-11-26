package com.smart_home.SmartHome.repositories;

import com.smart_home.SmartHome.models.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SceneRepository extends JpaRepository<Scene, Long> {
    List<Scene> findByNameContainingIgnoreCase(String name);
    Scene findByNameIgnoreCase(String name);
    void deleteByNameIgnoreCase(String name);
}
