package sist.backend.test;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class TestController {

  @GetMapping("/test")
  public Map<String, Object> test() {
    return Map.of("message", "hello world", "status", "success");
  }
}
