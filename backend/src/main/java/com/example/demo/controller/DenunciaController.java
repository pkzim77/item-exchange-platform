
	package com.example.demo.controller;

import com.example.demo.dto.DenunciaRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Denuncia;
import com.example.demo.service.DenunciaService;
import com.example.demo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    // PEGAR ID DO USUÁRIO LOGADO
    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();
        return usuarioService.findByEmail(email).getId();
    }

    // -------------------- REGISTRAR DENÚNCIA --------------------
    @PostMapping("/{itemId}")
    public ResponseEntity<?> registrarDenuncia(
            @PathVariable Long itemId,
            @RequestBody DenunciaRequest request,
            Authentication authentication
    ) {

        // 1. Usuário precisa estar logado
        Long denuncianteId = getAuthenticatedUserId(authentication);
        if (denuncianteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Você precisa estar logado para fazer uma denúncia.");
        }

        // 2. Motivo obrigatório
        if (request.getMotivo() == null || request.getMotivo().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("O motivo da denúncia é obrigatório.");
        }

        try {
            // 3. Registrar denúncia
            Denuncia denunciaSalva = denunciaService.registrarDenuncia(
                    itemId,
                    request.getMotivo(),
                    denuncianteId
            );

            // 4. Retorno padronizado
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Denúncia registrada com sucesso.");

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

