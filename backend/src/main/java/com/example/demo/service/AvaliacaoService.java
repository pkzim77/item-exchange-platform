
package com.example.demo.service;

import com.example.demo.dto.AvaliacaoDTO;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Avaliacao;
import com.example.demo.model.Negociacao;
import com.example.demo.model.Usuario;
import com.example.demo.repository.AvaliacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AvaliacaoService {

    private final AvaliacaoRepository repo;
    private final NegociacaoService negociacaoService;
    private final UsuarioService usuarioService;

    public AvaliacaoService(AvaliacaoRepository repo,
                            NegociacaoService negociacaoService,
                            UsuarioService usuarioService) {
        this.repo = repo;
        this.negociacaoService = negociacaoService;
        this.usuarioService = usuarioService;
    }

    private void validar(Avaliacao a) {
        if (a.getNota() == null || a.getNota() < 1 || a.getNota() > 5)
            throw new IllegalArgumentException("A nota deve estar entre 1 e 5");

        if (a.getComentario() == null || a.getComentario().isBlank())
            throw new IllegalArgumentException("O comentário é obrigatório");
    }

    public AvaliacaoDTO salvar(Long negociacaoId, Avaliacao avaliacao, Long userId) {

        validar(avaliacao);

        Negociacao n = negociacaoService.findById(negociacaoId);

        if (n.getStatus() != Negociacao.StatusNegociacao.FINALIZADA) {
            throw new IllegalArgumentException("A troca ainda não foi concluída");
        }

        // Verifica se o usuário pertence à negociação (proprietário do item ou comprador)
        Usuario proprietario = n.getItem().getProprietario();
        Usuario comprador = n.getComprador();

        boolean isProprietario = proprietario != null && userId.equals(proprietario.getId());
        boolean isComprador = comprador != null && userId.equals(comprador.getId());

        if (!isProprietario && !isComprador) {
            throw new IllegalArgumentException("Você não participa desta negociação e não pode avaliá-la");
        }

        // Verifica se o mesmo usuário já avaliou essa negociação
        if (repo.findByNegociacaoIdAndAvaliadorId(negociacaoId, userId).isPresent()) {
            throw new IllegalArgumentException("Você já deixou uma avaliação para esta negociação");
        }

        Usuario avaliador = usuarioService.findById(userId);

        // Define corretamente quem será avaliado: a outra parte da negociação
        Usuario avaliado = isProprietario ? comprador : proprietario;

        if (avaliado == null) {
            throw new IllegalArgumentException("Não foi possível identificar a parte a ser avaliada nesta negociação");
        }

        // Garantir que o avaliador não seja o próprio avaliado
        if (avaliador.getId().equals(avaliado.getId())) {
            throw new IllegalArgumentException("Você não pode avaliar a si mesmo");
        }

        // Ignorar qualquer avaliador/avaliado enviado pelo cliente e setar os corretos
        avaliacao.setAvaliador(avaliador);
        avaliacao.setAvaliado(avaliado);
        avaliacao.setNegociacao(n);
        avaliacao.setDataCriacao(LocalDateTime.now());

        repo.save(avaliacao);
        atualizarMedia(avaliado.getId());

        return AvaliacaoDTO.fromEntity(avaliacao);
    }

    public AvaliacaoDTO editar(Long id, Avaliacao novo, Long userId) {

        validar(novo);

        Avaliacao a = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação não encontrada"));

        if (!a.getAvaliador().getId().equals(userId))
            throw new IllegalArgumentException("Você só pode editar seu próprio feedback");

        a.setComentario(novo.getComentario());
        a.setNota(novo.getNota());
        a.setDataAtualizacao(LocalDateTime.now());

        repo.save(a);
        atualizarMedia(a.getAvaliado().getId());

        return AvaliacaoDTO.fromEntity(a);
    }

    public void excluir(Long id, Long userId) {

        Avaliacao a = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Avaliação não encontrada"));

        if (!a.getAvaliador().getId().equals(userId))
            throw new IllegalArgumentException("Você só pode excluir seu próprio feedback");

        Long avaliadoId = a.getAvaliado().getId();

        repo.delete(a);
        atualizarMedia(avaliadoId);
    }

    public List<AvaliacaoDTO> listarPorAvaliado(Long id) {
        return repo.findByAvaliadoId(id)
                .stream()
                .map(AvaliacaoDTO::fromEntity)
                .toList();
    }

    private void atualizarMedia(Long id) {
        Double media = repo.media(id);
        Usuario user = usuarioService.findById(id);
        user.setNotaAvaliacao(media == null ? 0 : media);
        usuarioService.save(user);
    }
}


