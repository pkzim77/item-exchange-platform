package com.example.demo.segurity;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration 
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
	    return http
	            .csrf(csrf -> csrf.disable()) 
	            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	            .authorizeHttpRequests(authorize -> authorize
	            		
	            		// 1. Libera Rota de Cadastro e Login (PermitAll)
	            		.requestMatchers(HttpMethod.POST, "/api/usuarios").permitAll()	
	            		.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
	            		// 2. Libera GETs Públicos (para visualização de listagem e detalhes)
	            		.requestMatchers(HttpMethod.GET, "/api/itens/**").permitAll()
	            		.requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
	            		.requestMatchers(HttpMethod.GET, "/api/usuarios/**").permitAll()
	            		// 3. OBRIGATÓRIO: Qualquer outra requisição (POST/PUT/DELETE)
	            		.anyRequest().authenticated())
	            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
	            .build();
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
