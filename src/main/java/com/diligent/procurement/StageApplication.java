package com.diligent.procurement;

public class StageApplication {
    public static void main(String[] args) {
        System.setProperty("SPRING_PROFILES_ACTIVE", "stage");
        System.setProperty("spring.profiles.active", "stage");

        Application.main(args);
    }
}
