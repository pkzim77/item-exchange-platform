
	package com.example.demo.service;

	import com.example.demo.exception.ResourceNotFoundException;
	import com.example.demo.model.Avaliacao;
	import com.example.demo.model.Negociacao;
	import com.example.demo.model.Negociacao.StatusNegociacao;
	import com.example.demo.model.Usuario;
	import com.example.demo.repository.AvaliacaoRepository;
	import org.springframework.stereotype.Service;
	import org.springframework.transaction.annotation.Transactional;

	import java.time.LocalDateTime;
import java.util.List;

	@Service
	public class AvaliacaoService {

	    private final AvaliacaoRepository avaliacaoRepository;
	    private final NegociacaoService negociacaoService;
	    private final UsuarioService usuarioService;

	    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, NegociacaoService negociacaoService, UsuarioService usuarioService) {
	        this.avaliacaoRepository = avaliacaoRepository;
	        this.negociacaoService = negociacaoService;
	        this.usuarioService = usuarioService;
	    }

	    @Transactional
	    public Avaliacao salvarAvaliacao(Avaliacao novaAvaliacao, Long negociacaoId, Long avaliadorId) {

	        // 1. Validar Negociação e Status
	        Negociacao negociacao = negociacaoService.findById(negociacaoId);

	        if (negociacao.getStatus() != StatusNegociacao.FINALIZADA) {
	            throw new IllegalStateException("A negociação deve estar FINALIZADA para ser avaliada.");
	        }
	        if (avaliacaoRepository.findByNegociacaoId(negociacaoId).isPresent()) {
	            throw new IllegalStateException("Esta negociação já foi avaliada.");
	        }
	        if (novaAvaliacao.getNota() == null || novaAvaliacao.getNota() < 1 || novaAvaliacao.getNota() > 5) {
	            throw new IllegalArgumentException("A nota deve estar entre 1 e 5.");
	        }


	        Long proprietarioId = negociacao.getItem().getProprietario().getId();
	        Long compradorId = negociacao.getComprador().getId();

	        Usuario avaliado;
	        Usuario avaliador = usuarioService.findById(avaliadorId);

	        if (avaliadorId.equals(proprietarioId)) {

	            avaliado = negociacao.getComprador();
	        } else if (avaliadorId.equals(compradorId)) {

	            avaliado = negociacao.getItem().getProprietario();
	        } else {
	            throw new SecurityException("Usuário não autorizado a avaliar esta negociação.");
	        }

	        // 3. Preencher e Salvar a Avaliação
	        novaAvaliacao.setNegociacao(negociacao);
	        novaAvaliacao.setAvaliador(avaliador);
	        novaAvaliacao.setAvaliado(avaliado);
	        novaAvaliacao.setDataAvaliacao(LocalDateTime.now());
	        
	        Avaliacao avaliacaoSalva = avaliacaoRepository.save(novaAvaliacao);
	        recalcularNotaUsuario(avaliado.getId());

	        return avaliacaoSalva;
	    }

	    @Transactional
	    public void recalcularNotaUsuario(Long usuarioId) {
	        Double media = avaliacaoRepository.calcularMediaAvaliacoesPorUsuario(usuarioId);
	        Integer total = avaliacaoRepository.contarAvaliacoesPorUsuario(usuarioId);

	        Usuario usuario = usuarioService.findById(usuarioId);

	        if (media != null) {
	            double notaArredondada = Math.round(media * 10.0) / 10.0;
	            usuario.setNotaAvaliacao(notaArredondada);
	        } else {
	            usuario.setNotaAvaliacao(0.0);
	        }

	        usuario.setQuantidadeAvaliacoes(total != null ? total : 0);

	        usuarioService.save(usuario);
	    }
	    
	    public List<Avaliacao> listarTodas() {
	        return avaliacaoRepository.findAll();
	    }
	    
	    public Avaliacao buscarPorNegociacao(Long negociacaoId) {
	        return avaliacaoRepository.findByNegociacaoId(negociacaoId)
	                .orElseThrow(() -> new ResourceNotFoundException("Nenhuma avaliação encontrada para esta negociação."));
	    }
	    
	    
	}

