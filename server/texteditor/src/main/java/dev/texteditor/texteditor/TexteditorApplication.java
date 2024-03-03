package dev.texteditor.texteditor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;


@SpringBootApplication
@RestController
public class TexteditorApplication {

	public static void main(String[] args) {
		SpringApplication.run(TexteditorApplication.class, args);
	}

	@GetMapping("/root")
	public String getMethodName() {
		return new String("Hello World");
	}
	

}
