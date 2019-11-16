package com.diligent.admin;

public class ProdApplication {
    public static void main(String[] args) {
        System.setProperty("SPRING_PROFILES_ACTIVE", "prod");
        System.setProperty("spring.profiles.active", "prod");

        Application.main(args);
    }
}
