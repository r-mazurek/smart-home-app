package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.EventLog;
import com.smart_home.SmartHome.services.EventLogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/logs")
public class LogsController {
    private final EventLogService service;

    public LogsController(EventLogService service) {
        this.service = service;
    }

    @GetMapping
    public List<EventLog> getAllLogs() {
        return service.getEventLogs();
    }
}
