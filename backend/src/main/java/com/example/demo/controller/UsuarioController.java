package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Usuario;
import com.example.demo.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
	
	private final UsuarioService usuarioService; 
	
	public UsuarioController (UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}
	@PostMapping
	public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario novoUsuario){
		try {
			Usuario usuarioSalvo = usuarioService.salvar(novoUsuario);
			return new ResponseEntity<>(usuarioSalvo,HttpStatus.CREATED);
		} catch ( RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}
}
