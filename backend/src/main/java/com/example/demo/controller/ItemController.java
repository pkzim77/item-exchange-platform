package com.example.demo.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.Item;
import com.example.demo.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/itens")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item) {
        Item novoItem = itemService.save(item);
        return new ResponseEntity<>(novoItem, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<Item>> getAllItens(
            @PageableDefault(size = 50, page = 0) Pageable pageable) {

        Page<Item> itensPage = itemService.findAll(pageable);

        if (itensPage.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(itensPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemService.findById(id);

        if (item.isPresent()) {
            return ResponseEntity.ok(item.get());
        } else {
            // Retorna 404 Not Found se o item não for encontrado
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Item>> buscarPorCategoria(
            @RequestParam String categoria) {

        List<Item> itens = itemService.buscarPorCategoria(categoria);

        if (itens.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(itens);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Item> atualizarItem(@PathVariable Long id, @RequestBody Item item) {
        try {
            Item itemAtualizado = itemService.atualizarItem(id, item);
            return ResponseEntity.ok(itemAtualizado);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatusCode());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarItem(@PathVariable Long id) {
        itemService.deletarItem(id);
        return ResponseEntity.noContent().build();
    }

    // Novo endpoint (hard delete - deleta permanentemente do banco)
    @DeleteMapping("/{id}/permanente")
    public ResponseEntity<Void> deletarItemPermanente(@PathVariable Long id) {
        itemService.deletarItemPermanente(id);
        return ResponseEntity.noContent().build();
    }

}
