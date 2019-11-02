package com.diligent.procurement.webapi;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Reference: https://www.baeldung.com/spring-boot-custom-error-page
 */
@Controller
public class MyErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        return "forward:/index.html";
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }
}
