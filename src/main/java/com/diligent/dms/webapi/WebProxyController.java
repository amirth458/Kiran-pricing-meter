package com.diligent.dms.webapi;


import org.eclipse.jetty.server.Request;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RequestMapping("/")
@RestController
@RestControllerAdvice
@CrossOrigin("*")
public class WebProxyController {

    private static final Logger LOG = LoggerFactory.getLogger(WebProxyController.class);

    @RequestMapping("/healthcheck")
    public ResponseEntity<String> healthCheck() {
        ResponseEntity<String> response = new ResponseEntity<String>("{\"status\": \"UP\"}", HttpStatus.OK);

        return response;
    }

    @RequestMapping("/error")
    public String errorHandler(HttpServletResponse response,
                               HttpServletRequest request) {
        LOG.info("Error in request");
        return String.format("Request from %s had errors - %s",((Request) request).getOriginalURI(),response.toString());
    }

}
