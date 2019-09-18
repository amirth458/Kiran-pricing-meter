package com.diligent.dms.webapi;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RequestMapping("/")
@RestController
@RestControllerAdvice
@CrossOrigin("*")
public class WebProxyController {

    private static final Logger LOG = LoggerFactory.getLogger(WebProxyController.class);


}
