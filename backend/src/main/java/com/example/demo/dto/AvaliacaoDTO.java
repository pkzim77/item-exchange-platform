package com.example.demo.dto;

import com.example.demo.model.Avaliacao;
import java.time.LocalDateTime;

public class AvaliacaoDTO {

    private Long id;
    private String comentario;
    private Integer nota;
    private Long avaliadorId;
    private String avaliadorNome;
    private Long avaliadoId;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public static AvaliacaoDTO fromEntity(Avaliacao a) {

        AvaliacaoDTO dto = new AvaliacaoDTO();

        dto.id = a.getId();
        dto.comentario = a.getComentario();
        dto.nota = a.getNota();
        dto.avaliadorId = a.getAvaliador().getId();
        dto.avaliadorNome = a.getAvaliador().getNome();
        dto.avaliadoId = a.getAvaliado().getId();
        dto.dataCriacao = a.getDataCriacao();
        dto.dataAtualizacao = a.getDataAtualizacao();
        return dto;
    }

    // GETTERS E SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public Long getAvaliadorId() { return avaliadorId; }
    public void setAvaliadorId(Long avaliadorId) { this.avaliadorId = avaliadorId; }

    public String getAvaliadorNome() { return avaliadorNome; }
    public void setAvaliadorNome(String avaliadorNome) { this.avaliadorNome = avaliadorNome; }

    public Long getAvaliadoId() { return avaliadoId; }
    public void setAvaliadoId(Long avaliadoId) { this.avaliadoId = avaliadoId; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
}



