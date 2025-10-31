package com.example.demo.config;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;

@Service
public class UsuarioDetailsService implements UserDetailsService{
	  private final UsuarioRepository usuarioRepository;

	    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
	        this.usuarioRepository = usuarioRepository;
	    }

	    @Override
	    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	        Usuario usuario = usuarioRepository.findByEmail(email)
	                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
	        return new UsuarioDetails(usuario);
	    }
	}

