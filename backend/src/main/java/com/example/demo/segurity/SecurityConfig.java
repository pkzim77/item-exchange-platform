package com.example.demo.segurity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer; // IMPORT ADICIONADO
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource; // IMPORT ADICIONADO
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List; // IMPORT ADICIONADO

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    // ✨ NOVO: Adiciona o JwtAuthFilter como um campo final
    private final JwtAuthFilter jwtAuthFilter;

    // ✨ NOVO: Construtor para injetar o filtro
    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

	@Bean
    // ❌ ATENÇÃO: Remova o JwtAuthFilter da lista de argumentos
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { 
	    return http
	            // ... (CSRF, CORS, Session Management permanecem iguais)
	            .csrf(csrf -> csrf.disable())
	            .cors(Customizer.withDefaults()) 

	            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	            
	            // 2. CONFIGURAÇÃO DE AUTORIZAÇÃO
	            .authorizeHttpRequests(authorize -> authorize
	                    .requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll() 
	                    .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
	                    // ... (demais permitAll)
	                    .anyRequest().authenticated()
	            )
	            
	            // 3. Usa o campo injetado para adicionar o filtro
	            .addFilterBefore(this.jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
	            .build();
	}

	// ✨ NOVO MÉTODO PARA CONFIGURAÇÃO CORS (substitui o CorsFilter)
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    // Incluí 3000 (do CorsConfig inicial) e 5173 (do ItemController)
	    configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    configuration.setAllowedHeaders(List.of("*"));
	    configuration.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}


	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

}