
	package com.example.demo.controller;

	import com.example.demo.model.Avaliacao;
	import com.example.demo.service.AvaliacaoService;
	import com.example.demo.service.UsuarioService;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.security.core.Authentication;
	import org.springframework.security.core.context.SecurityContextHolder;
	import org.springframework.web.bind.annotation.*;

	@RestController
	@RequestMapping("/api/avaliacoes")
	public class AvaliacaoController {

	    private final AvaliacaoService avaliacaoService;
	    private final UsuarioService usuarioService; 

	    public AvaliacaoController(AvaliacaoService avaliacaoService, UsuarioService usuarioService) {
	        this.avaliacaoService = avaliacaoService;
	        this.usuarioService = usuarioService;
	    }

	    private Long getAuthenticatedUserId() {
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        String userEmail = authentication.getName();
	        // Usando o findByEmail que retorna Usuario (já ajustado)
	        return usuarioService.findByEmail(userEmail).getId();
	    }

	    @PostMapping("/{negociacaoId}")
	    public ResponseEntity<?> criarAvaliacao(
	            @PathVariable Long negociacaoId,
	            @RequestBody Avaliacao avaliacao) {
	        
	        Long avaliadorId = getAuthenticatedUserId();

	        try {
	            Avaliacao novaAvaliacao = avaliacaoService.salvarAvaliacao(avaliacao, negociacaoId, avaliadorId);
	            return new ResponseEntity<>(novaAvaliacao, HttpStatus.CREATED);
	        } catch (IllegalStateException | SecurityException | IllegalArgumentException e) {
	            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	        }
	    }
	}

