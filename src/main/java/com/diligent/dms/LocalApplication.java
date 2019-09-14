package com.diligent.dms;

public class LocalApplication {
    public static void main(String[] args) {
        System.setProperty("server.port", "8080");
        Application.main(args);
    }
}
