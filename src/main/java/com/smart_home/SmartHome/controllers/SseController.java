package com.smart_home.SmartHome.controllers;

import com.smart_home.SmartHome.models.EventLog;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
public class SseController {
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    // Endpoint
    @GetMapping(value="/stream-logs", produces= MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamLogs() {
        SseEmitter emitter = new SseEmitter(300000L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }

    // Metoda do wysylania zdarzen
    public void sendLogToClients(EventLog log) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("new-log").data(log));
            } catch (IOException e) {
                emitters.remove(emitter);
            }
        }
    }
}
