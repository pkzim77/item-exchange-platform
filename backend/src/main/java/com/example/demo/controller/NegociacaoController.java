package com.example.demo.controller;

import com.example.demo.dto.AtualizarStatusRequest;
import com.example.demo.model.Negociacao;
import com.example.demo.model.Usuario;
import com.example.demo.service.NegociacaoService;
import com.example.demo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/negociacoes")
public class NegociacaoController {

	private final NegociacaoService negociacaoService;
	private final UsuarioService usuarioService;

	public NegociacaoController(NegociacaoService negociacaoService, UsuarioService usuarioService) {
		this.negociacaoService = negociacaoService;
		this.usuarioService = usuarioService;
	}

	private Long getAuthenticatedUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		// O principal é o email (String) que foi configurado no JwtAuthFilter
		String userEmail = authentication.getName();
		Usuario usuario = usuarioService.findByEmail(userEmail);
		return usuario.getId();
	}

	// Endpoints específicos com prefixos claros (colocar ANTES dos genéricos)
	@GetMapping("/historico")
	public ResponseEntity<List<Negociacao>> getHistoricoNegociacoes() {
		Long userId = getAuthenticatedUserId();
		List<Negociacao> historico = negociacaoService.getHistoricoNegociacoes(userId);
		return ResponseEntity.ok(historico);
	}

	@PostMapping("/{negociacaoId}/confirmar")
	public ResponseEntity<Negociacao> confirmarTroca(@PathVariable Long negociacaoId) {
		Long userId = getAuthenticatedUserId();
		Negociacao negociacaoAtualizada = negociacaoService.confirmarTroca(negociacaoId, userId);
		return ResponseEntity.ok(negociacaoAtualizada);
	}

	@PostMapping("/item/{itemId}/sem-comprador")
	public ResponseEntity<Negociacao> iniciarNegociacaoSemComprador(@PathVariable Long itemId) {
		Negociacao novaNegociacao = negociacaoService.iniciarNegociacao(itemId, null);
		return new ResponseEntity<>(novaNegociacao, HttpStatus.CREATED);
	}

	// Endpoints genéricos por último
	@PostMapping("/item/{itemId}")
	public ResponseEntity<Negociacao> iniciarNegociacao(@PathVariable Long itemId) {
		Long compradorId = getAuthenticatedUserId();
		Negociacao novaNegociacao = negociacaoService.iniciarNegociacao(itemId, compradorId);
		return new ResponseEntity<>(novaNegociacao, HttpStatus.CREATED);
	}

	@PatchMapping("/{negociacaoId}")
	public ResponseEntity<Negociacao> atualizarStatus(
			@PathVariable Long negociacaoId,
			@RequestBody AtualizarStatusRequest request) {

		Long userId = getAuthenticatedUserId();
		Negociacao negociacaoAtualizada = negociacaoService.atualizarStatus(
				negociacaoId, request.getStatus(), userId);
		return ResponseEntity.ok(negociacaoAtualizada);
	}
}