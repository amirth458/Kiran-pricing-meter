package com.diligent.dms.webapi;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RequestMapping("/api")
@RestController
@RestControllerAdvice
@CrossOrigin("*")
public class WebProxyController {

    private static final Logger LOG = LoggerFactory.getLogger(WebProxyController.class);

    @RequestMapping("get-environment")
    public ResponseEntity getEnvironment() {
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("SPRING_PROFILES_ACTIVE_property", System.getProperty("SPRING_PROFILES_ACTIVE"));
        responseMap.put("SPRING_PROFILES_ACTIVE_env", System.getenv("SPRING_PROFILES_ACTIVE"));

        responseMap.put("spring_active_profile_property", System.getProperty("spring.profiles.active"));
        responseMap.put("spring_active_profile_env", System.getenv("spring.profiles.active"));
        return ResponseEntity.ok(responseMap);
    }
}
