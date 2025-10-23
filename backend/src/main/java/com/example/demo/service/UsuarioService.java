package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UsuarioService {
	
	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	
	public UsuarioService (UsuarioRepository usuarioRepository,PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}
	
	public Usuario salvar(Usuario usuario) {
		if(usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
			throw new RuntimeException("Email já cadastrado no sistema.");
		}
		
		String senhaCriptografada = passwordEncoder.encode(usuario.getSenha());
        usuario.setSenha(senhaCriptografada);
        return usuarioRepository.save(usuario);
	}
	
	//metodo auxiliar para login
	public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
	
	public Usuario autenticar(String email, String senha) {
		Usuario usuario = usuarioRepository.findByEmail(email)
		.orElseThrow(()-> new RuntimeException("credenciais invalidas."));
		
		if(!passwordEncoder.matches(senha, usuario.getSenha())) {
			throw new RuntimeException("Credenciais inválidas.");
		}
		
		return usuario;
	}
}
