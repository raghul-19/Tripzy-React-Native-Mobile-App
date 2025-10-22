package com.example.Backend.Configurations;

import com.example.Backend.Service.Authentication.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity

public class SecurityConfigurations {

    @Autowired
    JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain configureSecurityFilterChain(HttpSecurity http) throws Exception {
        return
                http
                        .cors(cors -> cors.configurationSource(urlBasedUrlBasedCorsConfigurations()))
                        .csrf(csrf -> csrf.disable())
                        .authorizeHttpRequests(authz ->
                            authz.requestMatchers("/auth/**").permitAll()
                                    .anyRequest().authenticated()
                        )
                        .formLogin(formLogin -> formLogin.disable())
                        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                        .build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource urlBasedUrlBasedCorsConfigurations() {
        CorsConfiguration corsConfiguration=new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:8081","http://192.168.1.3:8081","http://10.211.138.107:8081"));
        corsConfiguration.setAllowedMethods(List.of("GET","POST","PUT","DELETE"));
        corsConfiguration.setAllowedHeaders(List.of("Authorization","Content-Type","Accept"));
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource=new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**",corsConfiguration);
        return urlBasedCorsConfigurationSource;
    }
}
