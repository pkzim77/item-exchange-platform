package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer nota;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comentario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "negociacao_id", nullable = false)
    private Negociacao negociacao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "avaliador_id", nullable = false)
    private Usuario avaliador;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "avaliado_id", nullable = false)
    private Usuario avaliado;
    
    @Column(nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    private LocalDateTime dataAtualizacao;
    
    @Column(nullable = false)
    private Boolean avaliacaoConcluida = false;

    // GETTERS E SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public Negociacao getNegociacao() { return negociacao; }
    public void setNegociacao(Negociacao negociacao) { this.negociacao = negociacao; }

    public Usuario getAvaliador() { return avaliador; }
    public void setAvaliador(Usuario avaliador) { this.avaliador = avaliador; }

    public Usuario getAvaliado() { return avaliado; }
    public void setAvaliado(Usuario avaliado) { this.avaliado = avaliado; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDateTime dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }
    
    public Boolean getAvaliacaoConcluida() { return avaliacaoConcluida; }
    public void setAvaliacaoConcluida(Boolean avaliacaoConcluida) { this.avaliacaoConcluida = avaliacaoConcluida; }
    
    @PrePersist
    public void prePersist() {
        this.dataCriacao = LocalDateTime.now();
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    
}


