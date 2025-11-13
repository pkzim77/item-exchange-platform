
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

	    public NegociacaoService(NegociacaoRepository negociacaoRepository, ItemRepository itemRepository, UsuarioService usuarioService) {
	        this.negociacaoRepository = negociacaoRepository;
	        this.itemRepository = itemRepository;
	        this.usuarioService = usuarioService;
	    }

	    @Transactional
	    public Negociacao iniciarNegociacao(Long itemId, Long compradorId) {
	        Item item = itemRepository.findById(itemId)
	                .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado"));
	        Usuario comprador = usuarioService.findById(compradorId);
 
	        if (item.getProprietario().getId().equals(compradorId)) {
	            throw new IllegalArgumentException("Você não pode negociar seu próprio item.");
	        }
	        
	        long negociacoesPendentes = negociacaoRepository.countByItemIdAndStatus(itemId, StatusNegociacao.PENDENTE);
	        if (negociacoesPendentes > 0) {
	            throw new IllegalStateException("Este item já possui uma negociação pendente.");
	        }

	        Negociacao negociacao = new Negociacao();
	        negociacao.setItem(item);
	        negociacao.setComprador(comprador);
	        negociacao.setStatus(StatusNegociacao.PENDENTE);

	        return negociacaoRepository.save(negociacao);
	    }

	    @Transactional
	    public Negociacao confirmarTroca(Long negociacaoId, Long userId) {
	        Negociacao negociacao = negociacaoRepository.findById(negociacaoId)
	                .orElseThrow(() -> new ResourceNotFoundException("Negociação não encontrada"));
	       
	        if (negociacao.getStatus() != StatusNegociacao.PENDENTE) {
	             throw new IllegalStateException("A negociação não está no estado PENDENTE e não pode ser confirmada.");
	        }

	        Long proprietarioId = negociacao.getItem().getProprietario().getId();
	        Long compradorId = negociacao.getComprador().getId();

	 
	        if (userId.equals(proprietarioId)) {
	            negociacao.setProprietarioConfirmou(true);
	        } else if (userId.equals(compradorId)) {
	            negociacao.setCompradorConfirmou(true);
	        } else {
	            throw new SecurityException("Usuário não autorizado a confirmar esta negociação.");
	        }

	        // Verifica se AMBAS as partes confirmaram
	        if (negociacao.isCompradorConfirmou() && negociacao.isProprietarioConfirmou()) {
	            
	            // A troca foi confirmada por ambos: FINALIZAÇÃO
	            negociacao.setStatus(StatusNegociacao.FINALIZADA);
	            negociacao.setDataFinalizacao(LocalDateTime.now());
	            
	            // Executa RF1.6: Remove o item do ar (inativa a disponibilidade)
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

