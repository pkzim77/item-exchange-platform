package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        System.out.println("\n========== JwtAuthFilter ==========");
        System.out.println("[0] ROTA: " + method + " " + path);

        // 🔥 IGNORAR ROTAS PÚBLICAS:
        if (
                path.startsWith("/api/auth/login") ||                                   // login
                (path.startsWith("/api/usuarios") && method.equals("POST")) ||          // criar usuário
                path.matches("/api/negociacoes/item/.*/sem-comprador")                 // rota pública específica
        ) {
            System.out.println("[IGNORADO] Rota pública → filtro não valida token.\n");
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        System.out.println("[1] Authorization header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[2] Header ausente ou inválido. Seguindo sem autenticação.\n");
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        System.out.println("[3] Token extraído: " + jwt);

        String userEmail;
        try {
            userEmail = jwtService.extractUsername(jwt);
            System.out.println("[4] Email do token: " + userEmail);
        } catch (Exception e) {
            System.out.println("[ERRO] Falha ao extrair username: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails;
            try {
                userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                System.out.println("[5] UserDetails carregado.");
            } catch (Exception e) {
                System.out.println("[ERRO] Usuário não encontrado: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }

            boolean tokenValido;
            try {
                tokenValido = jwtService.isTokenValid(jwt, userDetails);
            } catch (Exception e) {
                System.out.println("[ERRO] Falha ao validar token.");
                filterChain.doFilter(request, response);
                return;
            }

            System.out.println("[6] Token válido? " + tokenValido);

            if (tokenValido) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("[7] Usuário autenticado: " + userDetails.getUsername());
            }
        }

        System.out.println("[8] Filtro finalizado, seguindo cadeia...\n");
        filterChain.doFilter(request, response);
    }
}
