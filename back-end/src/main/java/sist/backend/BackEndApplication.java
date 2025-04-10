package sist.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "sist.backend")
@EnableJpaRepositories(basePackages = "sist.backend") // ✅ 명시적으로 포함
@EntityScan(basePackages = "sist.backend.domain")  
public class BackEndApplication {

  public static void main(String[] args) {
    SpringApplication.run(BackEndApplication.class, args);
  }

}
