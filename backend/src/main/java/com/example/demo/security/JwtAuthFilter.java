package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // 💡 NOVO: Importe a interface correta
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	
	private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    
    public JwtAuthFilter( JwtService jwtService,UserDetailsService userDetailsService) { 
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }
	
    @Override 
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain )
            throws ServletException, IOException {

        System.out.println("\n========== JwtAuthFilter ==========");
        System.out.println("[1] Requisição: " + request.getMethod() + " " + request.getRequestURI());

        final String authHeader = request.getHeader("Authorization");
        System.out.println("[2] Authorization header recebido: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[3] Header ausente ou não começa com Bearer.");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        System.out.println("[4] Token extraído: " + jwt);

        String userEmail = null;
        try {
            userEmail = jwtService.extractUsername(jwt);
            System.out.println("[5] Email extraído do token: " + userEmail);
        } catch (Exception e) {
            System.out.println("[ERRO] Falha ao extrair email do token: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            System.out.println("[6] Nenhuma autenticação presente no SecurityContext. Tentando carregar usuário...");

            UserDetails userDetails = null;

            try {
                userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                System.out.println("[7] UserDetails carregado com sucesso: " + userDetails.getUsername());
            } catch (Exception e) {
                System.out.println("[ERRO] Usuário NÃO encontrado pelo email: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }

            boolean tokenValido = false;

            try {
                tokenValido = jwtService.isTokenValid(jwt, userDetails);
                System.out.println("[8] Token válido? " + tokenValido);
            } catch (Exception e) {
                System.out.println("[ERRO] Falha ao validar token: " + e.getMessage());
            }

            if (tokenValido) {
                System.out.println("[9] Token válido → autenticação será definida no SecurityContext.");

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("[10] SecurityContext preenchido com usuário: " + userDetails.getUsername());
            } else {
                System.out.println("[ERRO] Token inválido → SecurityContext NÃO será preenchido.");
            }
        }

        System.out.println("[11] Fim do filtro, seguindo cadeia...\n");
        filterChain.doFilter(request, response);
    }
}
