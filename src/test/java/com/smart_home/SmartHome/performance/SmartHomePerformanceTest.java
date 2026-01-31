package com.smart_home.SmartHome.performance;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SmartHomePerformanceTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.baseURI = "http://localhost";
    }

    @Test
    void shouldHandle1000RequestsInReasonableTime() {
        int requestCount = 1000;
        long maxDurationMs = 15000;

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < requestCount; i++) {
            given()
                    .when()
                    .get("/rooms")
                    .then()
                    .statusCode(200);
        }

        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        System.out.println("--------------------------------------------------");
        System.out.println("PERFORMANCE TEST RESULT:");
        System.out.println("Executed " + requestCount + " requests in " + duration + "ms");
        System.out.println("Average time per request: " + (double) duration / requestCount + "ms");
        System.out.println("--------------------------------------------------");

        assertTrue(duration < maxDurationMs,
                "Performance test failed! Took " + duration + "ms, expected < " + maxDurationMs + "ms");
    }
}