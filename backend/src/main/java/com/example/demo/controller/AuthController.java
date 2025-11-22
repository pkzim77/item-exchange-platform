package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.TokenResponse; 
import com.example.demo.model.Usuario;
import com.example.demo.security.JwtService;
import com.example.demo.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UsuarioService usuarioService;
	private final JwtService jwtService; 

	public AuthController(UsuarioService usuarioService, JwtService jwtService) { 
		this.usuarioService = usuarioService;
		this.jwtService = jwtService; 
	}
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest credenciais) {
		try {
			Usuario usuarioAutenticado = usuarioService.autenticar(
					credenciais.getEmail(),
					credenciais.getSenha());
						String token = jwtService.generateToken(usuarioAutenticado);
			
			// 💡 RETORNA O TOKEN ENCAPSULADO NO DTO DE RESPOSTA
			TokenResponse response = new TokenResponse(
					token, 
					"Bearer", 
					usuarioAutenticado.getNome(),
					usuarioAutenticado.getEmail());
			
			return ResponseEntity.ok(response);	
			
		} catch (RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED); 
		}
	}
}