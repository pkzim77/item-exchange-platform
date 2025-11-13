package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping; 
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.model.Usuario;
import com.example.demo.service.UsuarioService;
import com.example.demo.exception.ResourceNotFoundException; // Import necessário

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
    
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.findById(id); 
            return ResponseEntity.ok(usuario);
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.notFound().build(); 
        }
    }
}