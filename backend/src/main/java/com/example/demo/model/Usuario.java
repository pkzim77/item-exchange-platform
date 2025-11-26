package com.example.demo.model;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table (name = "tb_usuario")
public class Usuario implements UserDetails {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private String telefone;
	
	@Column(nullable = false)
	private String logradouro; 
    
	@Column(nullable = false)
	private String bairro; 
    
	@Column(nullable = false)
	private String cidade; 
    
	@Column(nullable = false)
	private String cep;
	// ------------------------------------------
	
	@Column(nullable = false, unique = true)
	private String email;
	
	@Column(nullable = false)
	private String senha;
	
	@Column(name = "nota_avaliacao", nullable = false)
	private Double notaAvaliacao = 0.0;
	
	@OneToMany(mappedBy = "proprietario", cascade = CascadeType.ALL, orphanRemoval = true)
	@com.fasterxml.jackson.annotation.JsonIgnore
	private List<Item> itens;
	
	@Column(name = "qtd_avaliacoes", nullable = false)
	private Integer quantidadeAvaliacoes = 0;
	
	public Usuario() {
		
	}

	public Usuario(Long id, String nome, String telefone, String logradouro, String bairro, String cidade, String cep, String email, String senha,
			Double notaAvaliacao) {
		super();
		this.id = id;
		this.nome = nome;
		this.telefone = telefone;
		this.logradouro = logradouro;
		this.bairro = bairro;
		this.cidade = cidade;
		this.cep = cep;
		this.email = email;
		this.senha = senha;
		this.notaAvaliacao = notaAvaliacao;
	}
    
    // --- GETTERS E SETTERS ---

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	// GETTERS E SETTERS NOVOS
	public String getLogradouro() {
		return logradouro;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}
	// FIM DOS NOVOS GETTERS E SETTERS
    
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public Double getNotaAvaliacao() {
		return notaAvaliacao;
	}

	public void setNotaAvaliacao(Double notaAvaliacao) {
		this.notaAvaliacao = notaAvaliacao;
	}

	public List<Item> getItens() {
	 return itens;
	}

	public void setItens(List<Item> itens) {
	this.itens = itens;
	}
	
	public Integer getQuantidadeAvaliacoes() {
	    return quantidadeAvaliacoes;
	}

	public void setQuantidadeAvaliacoes(Integer quantidadeAvaliacoes) {
	    this.quantidadeAvaliacoes = quantidadeAvaliacoes;
	}
	
	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Usuario other = (Usuario) obj;
		return Objects.equals(id, other.id);
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority("ROLE_USER"));
	}
	@Override
	public String getPassword() {
		return this.senha;
	}
	@Override
	public String getUsername() {
		return this.email;
	}
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	@Override
	public boolean isEnabled() {
		return true;
	}
}
