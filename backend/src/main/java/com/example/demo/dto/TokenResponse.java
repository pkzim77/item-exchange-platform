package com.example.demo.dto;

public class TokenResponse {
	private String accessToken;
    private String tipo;
    private String nomeUsuario;
    private String email;

    // Construtor
    public TokenResponse(String accessToken, String tipo, String nomeUsuario, String email) {
        this.accessToken = accessToken;
        this.tipo = tipo;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
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

