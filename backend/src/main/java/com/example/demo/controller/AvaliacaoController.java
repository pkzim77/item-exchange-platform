
package com.example.demo.controller;

import com.example.demo.model.Avaliacao;
import com.example.demo.service.AvaliacaoService;
import com.example.demo.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService service;
    private final UsuarioService usuarioService;

    public AvaliacaoController(AvaliacaoService service, UsuarioService usuarioService) {
        this.service = service;
        this.usuarioService = usuarioService;
    }

    private Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return usuarioService.findByEmail(auth.getName()).getId();
    }

    @PostMapping("/{negociacaoId}")
    public ResponseEntity<?> criar(@PathVariable Long negociacaoId,
                                   @RequestBody Avaliacao avaliacao) {
        return ResponseEntity.status(201)
                .body(service.salvar(negociacaoId, avaliacao, getUserId()));
    }

    @GetMapping("/avaliado/{usuarioId}")
    public ResponseEntity<?> listarAvaliados(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(service.listarPorAvaliado(usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id,
                                    @RequestBody Avaliacao avaliacao) {
        return ResponseEntity.ok(service.editar(id, avaliacao, getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        service.excluir(id, getUserId());
        return ResponseEntity.ok("Avaliação removida com sucesso.");
    }
}


