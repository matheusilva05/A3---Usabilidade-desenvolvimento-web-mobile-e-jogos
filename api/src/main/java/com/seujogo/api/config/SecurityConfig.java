package com.seujogo.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Expõe o BCrypt para ser usado em outras classes (ex: no Service)
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF (comum para APIs REST stateless)
            .csrf(csrf -> csrf.disable()) 
            // Habilita o CORS com a configuração padrão
            .cors(withDefaults()) 
            .authorizeHttpRequests(authz -> authz
                // Permite acesso a TODOS os endpoints sem autenticação
                // Em um app real, você protegeria o /score
                .anyRequest().permitAll() 
            );
        return http.build();
    }
}