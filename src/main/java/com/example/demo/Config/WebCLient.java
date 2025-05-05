import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

package com.example.demo.Config;


@Configuration
public class WebClientConfig {

    private static final String BASE_URL = "http://localhost:8080";

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
                .baseUrl(BASE_URL)
                .build();
    }
}