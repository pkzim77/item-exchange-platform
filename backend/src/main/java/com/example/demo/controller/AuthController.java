package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.Usuario;
import com.example.demo.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final UsuarioService usuarioService;
	
	public AuthController(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest credenciais) {
		try {
			Usuario usuarioAutenticado = usuarioService.autenticar(
					credenciais.getEmail(),
					credenciais.getSenha());
		return ResponseEntity.ok("login bem sucedido para: " + usuarioAutenticado.getNome());			
		} catch (RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
		}
	}
}
