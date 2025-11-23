package com.smart_home.SmartHome.models;

public class User {
    private final long id;
    private String name;
    private String password;
    // soon may add preferences or things like that to help AI suggest the best settings

    public User (long id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
