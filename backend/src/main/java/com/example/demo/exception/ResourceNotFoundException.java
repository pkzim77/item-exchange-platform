
	package com.example.demo.exception;
	import org.springframework.http.HttpStatus;
	import org.springframework.web.bind.annotation.ResponseStatus;

	@ResponseStatus(HttpStatus.NOT_FOUND) // Define que, ao ser lançada, deve retornar 404
	public class ResourceNotFoundException extends RuntimeException {

		private static final long serialVersionUID = 1L;

		// Construtor que recebe a mensagem de erro.
	    public ResourceNotFoundException(String message) {
	        super(message);
	    }
	}
