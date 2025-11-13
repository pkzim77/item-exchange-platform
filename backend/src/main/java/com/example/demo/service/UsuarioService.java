package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.demo.exception.ResourceNotFoundException;
import java.util.Optional;

@Service
public class UsuarioService {
	
	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	
	public UsuarioService (UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}
	
	// Método para cadastro de NOVOS usuários (aplica criptografia e validação)
	public Usuario salvar(Usuario usuario) {
		if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
			throw new RuntimeException("Email já cadastrado no sistema.");
		}
		
		String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
 		usuario.setSenha(senhaCriptografada);
 		return usuarioRepository.save(usuario);
	} 

	public Usuario save(Usuario usuario) {
	    return usuarioRepository.save(usuario);
	}
    
	public Usuario findById(Long id) {
		return usuarioRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com ID: " + id));
	}
	

	public Usuario findByEmail(String email) {
		return usuarioRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com email: " + email));
	}
	
	public Optional<Usuario> buscarPorEmail(String email) {
		return usuarioRepository.findByEmail(email);
	}

	public Usuario autenticar(String email, String senha) {
		Usuario usuario = usuarioRepository.findByEmail(email)
		.orElseThrow(()-> new RuntimeException("Credenciais inválidas."));
		
		if(!passwordEncoder.matches(senha, usuario.getSenha())) {
			throw new RuntimeException("Credenciais inválidas.");
		}
		
		return usuario;
		
	}	
}