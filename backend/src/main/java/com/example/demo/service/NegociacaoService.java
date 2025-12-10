
package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Item;
import com.example.demo.model.Negociacao;
import com.example.demo.model.Negociacao.StatusNegociacao;
import com.example.demo.model.Usuario;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.NegociacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NegociacaoService {

	private final NegociacaoRepository negociacaoRepository;
	private final ItemRepository itemRepository;
	private final UsuarioService usuarioService;

	public NegociacaoService(NegociacaoRepository negociacaoRepository, ItemRepository itemRepository,
			UsuarioService usuarioService) {
		this.negociacaoRepository = negociacaoRepository;
		this.itemRepository = itemRepository;
		this.usuarioService = usuarioService;
	}

	@Transactional
	public Negociacao iniciarNegociacao(Long itemId, Long compradorId) {
		// 1. Pega o item e o comprador
		Item item = itemRepository.findById(itemId)
				.orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));
		Usuario comprador = usuarioService.findById(compradorId);

		// 2. Verifica se o item está disponível
		if (!item.isDisponivel()) {
			throw new IllegalStateException("Este item já foi trocado e não está mais disponível para negociação.");
		}

		// 3. Impede que o proprietário negocie seu próprio item
		if (item.getProprietario().getId().equals(compradorId)) {
			throw new IllegalArgumentException("Você não pode negociar seu próprio item.");
		}

		// 4. Verifica se o **usuário específico** já iniciou negociação para este item
		boolean jaNegociou = negociacaoRepository.existsByItem_IdAndComprador_IdAndStatus(
				itemId,
				comprador.getId(),
				StatusNegociacao.PENDENTE);
		if (jaNegociou) {
			throw new IllegalStateException("Você já iniciou uma negociação para este item.");
		}

		// 5. Cria a negociação
		Negociacao negociacao = new Negociacao();
		negociacao.setItem(item);
		negociacao.setComprador(comprador);
		negociacao.setStatus(StatusNegociacao.PENDENTE);
		negociacao.setCompradorConfirmou(true); // já confirma o comprador

		return negociacaoRepository.save(negociacao);
	}

	@Transactional
	public Negociacao atualizarStatus(Long negociacaoId, String novoStatus, Long userId) {
		Negociacao negociacao = negociacaoRepository.findById(negociacaoId)
				.orElseThrow(() -> new ResourceNotFoundException("Negociação não encontrada"));

		Long proprietarioId = negociacao.getItem().getProprietario().getId();
		Long compradorId = negociacao.getComprador().getId();

		if (!userId.equals(proprietarioId) && !userId.equals(compradorId)) {
			throw new SecurityException("Usuário não autorizado a atualizar esta negociação.");
		}

		try {
			StatusNegociacao statusEnum = StatusNegociacao.valueOf(novoStatus.toUpperCase());
			negociacao.setStatus(statusEnum);
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Status inválido: " + novoStatus);
		}

		return negociacaoRepository.save(negociacao);
	}

	@Transactional
	public Negociacao confirmarTroca(Long negociacaoId, Long userId) {
		Negociacao negociacao = negociacaoRepository.findById(negociacaoId)
				.orElseThrow(() -> new ResourceNotFoundException("Negociação não encontrada"));

		// 1 — Só negociações PENDENTES podem ser confirmadas
		if (negociacao.getStatus() != StatusNegociacao.PENDENTE) {
			throw new IllegalStateException("A negociação não está mais pendente.");
		}

		Usuario usuario = usuarioService.findById(userId);

		Long proprietarioId = negociacao.getItem().getProprietario().getId();
		Long compradorId = negociacao.getComprador().getId();

		// 2 — Segurança: apenas comprador OU proprietário podem confirmar
		if (!userId.equals(proprietarioId) && !userId.equals(compradorId)) {
			throw new SecurityException("Usuário não autorizado a confirmar esta negociação.");
		}

		// 3 — Impede que alguém confirme duas vezes
		if (userId.equals(proprietarioId) && negociacao.isProprietarioConfirmou()) {
			throw new IllegalStateException("O proprietário já confirmou.");
		}

		if (userId.equals(compradorId) && negociacao.isCompradorConfirmou()) {
			throw new IllegalStateException("O comprador já confirmou.");
		}

		// 4 — Marca a confirmação correta
		if (userId.equals(proprietarioId)) {
			negociacao.setProprietarioConfirmou(true);
		} else {
			negociacao.setCompradorConfirmou(true);
		}

		// 5 — Se ambos confirmaram → finaliza a negociação
		if (negociacao.isCompradorConfirmou() && negociacao.isProprietarioConfirmou()) {
			negociacao.setStatus(StatusNegociacao.FINALIZADA);
			negociacao.setDataFinalizacao(LocalDateTime.now());
			Item item = negociacao.getItem();
			item.setDisponivel(false);
			itemRepository.save(item);
		}

		return negociacaoRepository.save(negociacao);
	}

	public List<Negociacao> getHistoricoNegociacoes(Long userId) {
		Usuario usuario = usuarioService.findById(userId); // Garante que o usuário existe
		// Usa o método customizado do Repository
		return negociacaoRepository.findByCompradorOrItemProprietario(usuario, usuario);
	}

	public Negociacao findById(Long id) {
		return negociacaoRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Negociação não encontrada"));
	}
}
