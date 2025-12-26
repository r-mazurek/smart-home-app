package com.smart_home.SmartHome.services;

import com.smart_home.SmartHome.models.EventLog;
import com.smart_home.SmartHome.repositories.EventLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventLogService {
    private final EventLogRepository eventLogRepository;

    public EventLogService(EventLogRepository eventLogRepository) {
        this.eventLogRepository = eventLogRepository;
    }

    public List<EventLog> getEventLogs(){
        return eventLogRepository.findAll();
    }
}
