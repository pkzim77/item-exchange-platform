package com.example.demo.dto;

public class TokenResponse {
	private Long id;
	private String accessToken;
    private String tipo;
    private String nomeUsuario;
    private String email;

    // Construtor
    public TokenResponse(String accessToken, String tipo, String nomeUsuario, String email,long id) {
        this.accessToken = accessToken;
        this.tipo = tipo;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.id = id;
    }

    // Getters
    public String getAccessToken() {
        return accessToken;
    }

    public String getTipo() {
        return tipo;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public String getEmail() {
        return email;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    // Setters (Opcionais, mas recomendados)
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    
    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

