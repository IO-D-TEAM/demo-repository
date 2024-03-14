package org.io_web.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSpring {
    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }
}
