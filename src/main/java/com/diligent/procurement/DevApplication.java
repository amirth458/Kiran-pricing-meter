package com.diligent.procurement;

public class DevApplication {
    public static void main(String[] args) {
        System.setProperty("SPRING_PROFILES_ACTIVE", "dev");
        System.setProperty("spring.profiles.active", "dev");

        Application.main(args);
    }
}
