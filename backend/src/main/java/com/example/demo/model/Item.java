package com.example.demo.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "item")
public class Item {
	
	@Id
 	@GeneratedValue(strategy = GenerationType.IDENTITY)
 	private Long id;
 	@Column(nullable = false, length = 100)
 	private String nome;
 	@Column(nullable = false, columnDefinition = "TEXT")
 	private String descricao;
 	@Column(nullable = false, length = 50)
 	private String categoria;
 	@Column(name = "foto_url")
 	private String fotoUrl;	
 	@Column(nullable = false)
 	private String endereco;	
 	
 	@ManyToOne(fetch = FetchType.EAGER)
 	@JoinColumn(name = "usuario_id", nullable = false)
 	@JsonIgnoreProperties("itens")
 	private Usuario proprietario;
 	
    @Column(nullable = false)
    private boolean disponivel = true; 
 	
 	@Column(name = "data_criacao", nullable = false, updatable = false)
 	private LocalDateTime dataCriacao;
 	
 	public Item() {
 		this.dataCriacao = LocalDateTime.now();
 	}

    // --- GETTERS E SETTERS ---

	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }

	public String getNome() { return nome; }
	public void setNome(String nome) { this.nome = nome; }

	public String getDescricao() { return descricao; }
	public void setDescricao(String descricao) { this.descricao = descricao; }

	public String getCategoria() { return categoria; }
	public void setCategoria(String categoria) { this.categoria = categoria; }

	public String getFotoUrl() { return fotoUrl; }
	public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

	public String getEndereco() { return endereco; }
	public void setEndereco(String endereco) { this.endereco = endereco; }

	public Usuario getProprietario() { // Usado no NegociacaoService
		return proprietario;
	}

	public void setUsuario(Usuario usuario) {
		this.proprietario = usuario;
	}

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) { 
        this.disponivel = disponivel;
    }
    
	public LocalDateTime getDataCriacao() {
		return dataCriacao;
	}

	public void setDataCriacao(LocalDateTime dataCriacao) {
		this.dataCriacao = dataCriacao;
	}	
}
