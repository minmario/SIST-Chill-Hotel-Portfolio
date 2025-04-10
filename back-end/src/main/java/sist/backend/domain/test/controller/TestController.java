package sist.backend.domain.test.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api")
public class TestController {
    // Test API endpoint
    @GetMapping("/test")
    public Map test() {
        System.out.println("Test API called");
        Map<String, Object> map = new HashMap<>();
        map.put("key", "testvalue");
        return map;
    }
}
