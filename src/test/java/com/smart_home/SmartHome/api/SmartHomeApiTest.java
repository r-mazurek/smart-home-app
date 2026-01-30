package com.smart_home.SmartHome.api;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SmartHomeApiTest {
    @LocalServerPort
    private int port;

    @BeforeEach
    private void setUp() {
        RestAssured.port = port;
        RestAssured.baseURI = "http://localhost";
    }

    @Test
    void shouldPerformFullSmartHomeScenerio() {
        // Create a room

        String roomName = "Office";

        given()
                .contentType(ContentType.JSON)
        .when()
                .post("/rooms/" + roomName)
        .then()
                .statusCode(200)
                .body("name", equalTo(roomName));

        // Add a lightbulb

        String testLampName = "DeskLamp";

        int testLampId =
        given()
                .queryParam("deviceName", testLampName)
                .queryParam("deviceType", "lightBulb")
        .when()
                .post("/rooms/" + roomName + "/devices")
        .then()
                .statusCode(200)
                .body("name", equalTo(testLampName))
                .body("on", equalTo(false))
                .extract().path("id");

        // turn the lightbulb on

        given()
        .when()
                .post("/rooms/" + roomName + "/devices/" + testLampId)
        .then()
                .statusCode(200)
                .body(equalTo("true"));

        // check if its really on

        given()
        .when()
                .get("/devices/" + testLampId)
        .then()
                .statusCode(200)
                .body("name", equalTo(testLampName))
                .body("isOn", equalTo(true));

        // check logs

        given()
        .when()
                .get("/logs")
        .then()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("message", hasItem(containsString(testLampName)));

        // Add a thermostat

        String testThermostatName = "KitchenThermostat";

        int thermostatId =
                given()
                        .queryParam("deviceType", "thermostat")
                        .queryParam("deviceName", testThermostatName)
                        .when()
                        .post("/rooms/" + roomName + "/devices")
                        .then()
                        .statusCode(200)
                        .body("name", equalTo(testThermostatName))
                        .body("on", equalTo(false))
                        .extract().path("id");

        // turn the thermostat on

        given()
                .when()
                .post("/rooms/" + roomName + "/devices/" + thermostatId)
                .then()
                .statusCode(200)
                .body(equalTo("true"));

        // check if its really on

        given()
                .when()
                .get("/devices/" + thermostatId)
                .then()
                .statusCode(200)
                .body("name", equalTo(testThermostatName))
                .body("isOn", equalTo(true));

        // check logs

        given()
                .when()
                .get("/logs")
                .then()
                .statusCode(200)
                .body("size()", greaterThan(0))
                .body("message", hasItem(containsString(testThermostatName)));


    }

}
