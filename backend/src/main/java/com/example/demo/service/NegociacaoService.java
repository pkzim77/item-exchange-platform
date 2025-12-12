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
		System.out.println("=== INICIANDO NEGOCIAÇÃO ===");
		System.out.println("ItemId recebido: " + itemId);
		System.out.println("CompradorId recebido: " + compradorId);
		
		// 1. Pega o item
		Item item = itemRepository.findById(itemId)
				.orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));
		
		System.out.println("Item encontrado: " + item.getId() + " - " + item.getNome());
		System.out.println("Categoria do item: " + item.getCategoria());

		// 2. Verifica se o item não está concluído
		if ("Concluido".equalsIgnoreCase(item.getCategoria())) {
			System.out.println("ERRO: Item já está concluído!");
			throw new IllegalStateException("Este item já foi trocado e não está mais disponível para negociação.");
		}

		// 3. Se compradorId foi fornecido, faz as validações
		Usuario comprador = null;
		if (compradorId != null) {
			System.out.println("Buscando comprador com ID: " + compradorId);
			comprador = usuarioService.findById(compradorId);
			System.out.println("Comprador encontrado: " + comprador.getEmail());

			// Impede que o proprietário negocie seu próprio item
			if (item.getProprietario().getId().equals(compradorId)) {
				System.out.println("ERRO: Proprietário tentando negociar próprio item!");
				throw new IllegalArgumentException("Você não pode negociar seu próprio item.");
			}

			// Verifica se o usuário específico já iniciou negociação para este item
			boolean jaNegociou = negociacaoRepository.existsByItem_IdAndComprador_IdAndStatus(
					itemId,
					comprador.getId(),
					StatusNegociacao.PENDENTE);
			if (jaNegociou) {
				System.out.println("ERRO: Usuário já tem negociação pendente para este item!");
				throw new IllegalStateException("Você já iniciou uma negociação para este item.");
			}
		} else {
			System.out.println("Criando negociação SEM comprador (compradorId = null)");
		}

		// 4. Cria a negociação
		Negociacao negociacao = new Negociacao();
		negociacao.setItem(item);
		negociacao.setComprador(comprador); // Pode ser null
		negociacao.setStatus(StatusNegociacao.PENDENTE);
		negociacao.setCompradorConfirmou(false);
		negociacao.setProprietarioConfirmou(false);

		Negociacao negociacaoSalva = negociacaoRepository.save(negociacao);
		System.out.println("Negociação criada com sucesso! ID: " + negociacaoSalva.getId());
		System.out.println("=== FIM INICIAR NEGOCIAÇÃO ===");
		
		return negociacaoSalva;
	}

	@Transactional
public Negociacao atualizarStatus(Long negociacaoId, String novoStatus, Long userId) {
    Negociacao negociacao = negociacaoRepository.findById(negociacaoId)
            .orElseThrow(() -> new ResourceNotFoundException("Negociação não encontrada"));

    Long proprietarioId = negociacao.getItem().getProprietario().getId();

    // Comprador pode ser null → evitar NullPointer
    Long compradorId = negociacao.getComprador() != null
            ? negociacao.getComprador().getId()
            : null;

    // 🔒 Autorização
    // Se comprador é null → somente o proprietário pode atualizar
    if (!userId.equals(proprietarioId) &&
        (compradorId == null || !userId.equals(compradorId))) {

        throw new SecurityException("Usuário não autorizado a atualizar esta negociação.");
    }

    // 🔄 Atualiza o status
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

		Long proprietarioId = negociacao.getItem().getProprietario().getId();

		// 2 — Se é o proprietário confirmando
		if (userId.equals(proprietarioId)) {
			if (negociacao.isProprietarioConfirmou()) {
				throw new IllegalStateException("O proprietário já confirmou.");
			}
			negociacao.setProprietarioConfirmou(true);
			
			// Proprietário confirmou → finaliza automaticamente
			negociacao.setStatus(StatusNegociacao.FINALIZADA);
			negociacao.setDataFinalizacao(LocalDateTime.now());
			
			// Muda a categoria do item para "Concluido" e marca como indisponível
			Item item = negociacao.getItem();
			item.setCategoria("Concluido");
			item.setDisponivel(false);
			itemRepository.save(item);
			
		} else {
			// 3 — Se não é proprietário, então é comprador
			if (negociacao.isCompradorConfirmou()) {
				throw new IllegalStateException("O comprador já confirmou.");
			}
			negociacao.setCompradorConfirmou(true);
			// Negociação continua PENDENTE, aguardando confirmação do proprietário
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