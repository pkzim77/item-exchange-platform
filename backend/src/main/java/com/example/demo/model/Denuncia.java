
	package com.example.demo.model;

	import jakarta.persistence.*;
	import java.time.LocalDateTime;

	@Entity
	@Table(name = "denuncias")
	public class Denuncia {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "item_id", nullable = false)
	    private Item item; // O item que está sendo denunciado

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "denunciante_id", nullable = false)
	    private Usuario denunciante; // O usuário que fez a denúncia

	    @Column(nullable = false, columnDefinition = "TEXT")
	    private String motivo; // Descrição do motivo da denúncia

	    @Column(nullable = false)
	    private LocalDateTime dataDenuncia = LocalDateTime.now();

	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private StatusDenuncia status = StatusDenuncia.PENDENTE;
	    
	    // Status para moderação
	    public enum StatusDenuncia {
	        PENDENTE,       // Aguardando revisão
	        APROVADA,       // Denúncia válida, item/usuário penalizado
	        REJEITADA       // Denúncia inválida
	    }


	    // --- Getters e Setters ---
	    public Long getId() { return id; }
	    public void setId(Long id) { this.id = id; }
	    
	    public Item getItem() { return item; }
	    public void setItem(Item item) { this.item = item; }
	    
	    public Usuario getDenunciante() { return denunciante; }
	    public void setDenunciante(Usuario denunciante) { this.denunciante = denunciante; }
	    
	    public String getMotivo() { return motivo; }
	    public void setMotivo(String motivo) { this.motivo = motivo; }
	    
	    public LocalDateTime getDataDenuncia() { return dataDenuncia; }
	    public void setDataDenuncia(LocalDateTime dataDenuncia) { this.dataDenuncia = dataDenuncia; }
	    
	    public StatusDenuncia getStatus() { return status; }
	    public void setStatus(StatusDenuncia status) { this.status = status; }
	}

