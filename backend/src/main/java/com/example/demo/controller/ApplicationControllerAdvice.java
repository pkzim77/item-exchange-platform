package com.example.demo.controller; 

import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApplicationControllerAdvice {

    // Trata ResourceNotFoundException -> HTTP 404
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiErrors handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ApiErrors(ex.getMessage());
    }

    // Trata SecurityException (FORBIDDEN, acesso negado) -> HTTP 403
    @ExceptionHandler(SecurityException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiErrors handleSecurityException(SecurityException ex) {
        return new ApiErrors(ex.getMessage());
    }

    // Trata IllegalStateException (ex: Negociação duplicada, item indisponível) -> HTTP 400
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors handleIllegalStateException(IllegalStateException ex) {
        return new ApiErrors(ex.getMessage());
    }

    // Trata IllegalArgumentException (ex: ID nulo, dado inválido) -> HTTP 400
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiErrors handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ApiErrors(ex.getMessage());
    }

    // Classe auxiliar para padronizar o corpo da resposta de erro JSON
    public static class ApiErrors {
        private String message;

        public ApiErrors(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}