package com.smart_home.SmartHome.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class EventLog {
    @Id
    private final Long id = UUID.randomUUID().getMostSignificantBits();

    private String message;
    private LocalDateTime timestamp;
    private String eventType;

    public EventLog() {}

    public EventLog(String eventType, String message) {
        this.eventType = eventType;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public long getId() { return id; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getEventType() { return eventType; }
}
