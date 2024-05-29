package org.io_web.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"org.io_web.backend.controllers", "org.io_web.backend.services",
        "org.io_web.backend.server", "org.io_web.backend.game", "org.io_web.backend.repositories", "org.io_web.backend.entities",
        "org.io_web.backend.repositories", "org.io_web.backend.exception_handler"})
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
