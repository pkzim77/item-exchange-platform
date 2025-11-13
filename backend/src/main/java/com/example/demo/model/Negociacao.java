package com.example.demo.model;
	import jakarta.persistence.*;
	import java.time.LocalDateTime;

	@Entity
	@Table(name = "negociacoes")
	public class Negociacao {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne
	    @JoinColumn(name = "item_id", nullable = false)
	    private Item item;

	    @ManyToOne
	    @JoinColumn(name = "comprador_id", nullable = false)
	    private Usuario comprador;

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private StatusNegociacao status = StatusNegociacao.PENDENTE;

	    private boolean compradorConfirmou = false;

	    private boolean proprietarioConfirmou = false;

	    @Column(nullable = false)
	    private LocalDateTime dataCriacao = LocalDateTime.now();
	    
	    private LocalDateTime dataFinalizacao;

	    // --- Enum para o Status ---
	    public enum StatusNegociacao {
	        PENDENTE,       
	        CONFIRMADA,     
	        REJEITADA,      
	        FINALIZADA      
	    }

	    public Negociacao() {
	    }
	    
	    // --- GETTERS E SETTERS ---

	    public Long getId() { 
	    	return id; }
	    
	    public void setId(Long id) { 
	    	this.id = id; }

	    public Item getItem() { 
	    	return item; }
	    
	    public void setItem(Item item) {
	    	this.item = item; }

	    public Usuario getComprador() { 
	    	return comprador; }
	    
	    public void setComprador(Usuario comprador) {
	    	this.comprador = comprador; } 

	    public StatusNegociacao getStatus() { 
	    	return status; }
	    
	    public void setStatus(StatusNegociacao status) { 
	    	this.status = status; } // CORRIGIDO: SETTER

	    public boolean isCompradorConfirmou() {
	    	return compradorConfirmou; } 
	    
	    public void setCompradorConfirmou(boolean compradorConfirmou) { 
	    	this.compradorConfirmou = compradorConfirmou; } // CORRIGIDO: SETTER

	    public boolean isProprietarioConfirmou() { 
	    	return proprietarioConfirmou; }
	   
	    public void setProprietarioConfirmou(boolean proprietarioConfirmou) { 
	    	this.proprietarioConfirmou = proprietarioConfirmou; } 

	    public LocalDateTime getDataCriacao() {
	    	return dataCriacao; }
	    
	    public void setDataCriacao(LocalDateTime dataCriacao) { 
	    	this.dataCriacao = dataCriacao; }

	    public LocalDateTime getDataFinalizacao() {
	    	return dataFinalizacao; }
	    
	    public void setDataFinalizacao(LocalDateTime dataFinalizacao) { 
	    	this.dataFinalizacao = dataFinalizacao; }
	}
