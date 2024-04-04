package org.io_web.backend;

import org.io_web.backend.mock_data.MockGameConfig;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSpring {
    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @GetMapping("/gameConfig")
    public MockGameConfig getConfig() {
        return new MockGameConfig(2, 40);
    }
}
