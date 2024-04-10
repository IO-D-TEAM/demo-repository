package org.io_web.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
<<<<<<< HEAD
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
=======
>>>>>>> main

@SpringBootApplication
@ComponentScan(basePackages = {"org.io_web.backend.controllers", "org.io_web.backend.services", "org.io_web.backend.server", "org.io_web.backend.game"})
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
