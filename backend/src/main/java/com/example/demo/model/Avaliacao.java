
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
	    private Integer nota; // Nota de 1 a 5

	    @Column(columnDefinition = "TEXT")
	    private String comentario;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "negociacao_id", nullable = false)
	    private Negociacao negociacao; // Vincula a avaliação à negociação que a gerou

	    // Usuário que fez a avaliação (o que deu a nota)
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "avaliador_id", nullable = false)
	    private Usuario avaliador;

	    // Usuário que recebeu a avaliação (o que foi avaliado)
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "avaliado_id", nullable = false)
	    private Usuario avaliado;

	    @Column(name = "data_avaliacao", nullable = false)
	    private LocalDateTime dataAvaliacao = LocalDateTime.now();

	    // Campo de controle para garantir que uma negociação só seja avaliada uma vez
	    private boolean avaliacaoConcluida = false; 


	    // --- Getters e Setters ---
	    
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
	    
	    public LocalDateTime getDataAvaliacao() { return dataAvaliacao; }
	    public void setDataAvaliacao(LocalDateTime dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

	    public boolean isAvaliacaoConcluida() { return avaliacaoConcluida; }
	    public void setAvaliacaoConcluida(boolean avaliacaoConcluida) { this.avaliacaoConcluida = avaliacaoConcluida; }
	}

