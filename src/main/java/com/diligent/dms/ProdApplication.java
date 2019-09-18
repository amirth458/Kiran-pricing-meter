package com.diligent.dms;

public class ProdApplication {
    public static void main(String[] args) {
        System.setProperty("SPRING_PROFILES_ACTIVE", "dev");
        System.setProperty("spring.profiles.active", "dev");

        Application.main(args);
    }
}
