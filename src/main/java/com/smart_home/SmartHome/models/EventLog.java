package com.smart_home.SmartHome.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EventLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
