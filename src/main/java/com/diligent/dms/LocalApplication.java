package com.diligent.dms;

public class LocalApplication {
    public static void main(String[] args) {
        System.setProperty("SPRING_PROFILES_ACTIVE", "local");
        System.setProperty("spring.profiles.active", "local");

        Application.main(args);
    }
}
