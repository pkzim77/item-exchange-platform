
	package com.example.demo.controller;

	import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Denuncia;
import com.example.demo.service.DenunciaService;
	import com.example.demo.service.UsuarioService;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.security.core.Authentication;
	import org.springframework.security.core.context.SecurityContextHolder;
	import org.springframework.web.bind.annotation.*;

	@RestController
	@RequestMapping("/api/denuncias")
	public class DenunciaController {

	    private final DenunciaService denunciaService;
	    private final UsuarioService usuarioService;

	    public DenunciaController(DenunciaService denunciaService, UsuarioService usuarioService) {
	        this.denunciaService = denunciaService;
	        this.usuarioService = usuarioService;
	    }

	    private Long getAuthenticatedUserId() {
	        // Assume que a autenticação está configurada para retornar o email
	        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        String userEmail = authentication.getName(); 
	        return usuarioService.findByEmail(userEmail).getId();
	    }

	    @PostMapping("/{itemId}")
	    public ResponseEntity<?> registrarDenuncia(
	            @PathVariable Long itemId,
	            @RequestBody DenunciaRequest request) { 
	        
	        Long denuncianteId = getAuthenticatedUserId();

	        if (request.getMotivo() == null || request.getMotivo().trim().isEmpty()) {
	             return new ResponseEntity<>("O motivo da denúncia é obrigatório.", HttpStatus.BAD_REQUEST);
	        }

	        try {
	            Denuncia denunciaSalva = denunciaService.registrarDenuncia(itemId, request.getMotivo(), denuncianteId);
	            return new ResponseEntity<>(denunciaSalva, HttpStatus.CREATED);
	        } catch (ResourceNotFoundException e) {
	            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
	        } catch (IllegalArgumentException e) {
	             return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	        }
	    }
	}


	class DenunciaRequest {
	    private String motivo;

	    public String getMotivo() { return motivo; }
	    public void setMotivo(String motivo) { this.motivo = motivo; }
	}

