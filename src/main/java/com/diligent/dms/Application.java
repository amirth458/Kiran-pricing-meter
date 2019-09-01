package com.diligent.dms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;

@SpringBootApplication
public class Application implements ErrorController {

	private static final Logger logger = LoggerFactory.getLogger(Application.class);

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@RequestMapping("/healthcheck")
	public ResponseEntity<String> healthCheck() {
		ResponseEntity<String> response = new ResponseEntity<String>("{\"status\": \"UP\"}", HttpStatus.OK);

		return response;
	}

	@RequestMapping("/error")
	public String ErrorPage() {
		return "index.html";
	}

	@Override
	public String getErrorPath() {
		return "index.html";
	}
}
