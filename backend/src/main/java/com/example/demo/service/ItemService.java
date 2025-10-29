package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.model.Item;
import com.example.demo.model.Usuario;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.UsuarioRepository;

@Service
public class ItemService {
	@Autowired
    private ItemRepository itemRepository;
	
	@Autowired
    private UsuarioRepository usuarioRepository;
	
	// Método de Criação (POST)
    public Item save(Item item) {
        if (item.getUsuario() == null || item.getUsuario().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID do usuário é obrigatório para criar um item.");
        }
        Usuario usuarioCompleto = usuarioRepository.findById(item.getUsuario().getId())
                .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND, 
                                "Usuário com ID " + item.getUsuario().getId() + " não encontrado."));
        item.setUsuario(usuarioCompleto);
        return itemRepository.save(item);
    }

    // Método de Listagem Geral (GET)
    public List<Item> findAll() {
        return itemRepository.findAll();
    }
    
    // Método de Busca por ID (GET /id)
    public Optional<Item> findById(Long id) {
        return itemRepository.findById(id);
    }

    // MÉTODO DE EXCLUSÃO (DELETE)
    public void deletarItem(Long id) {
    	if (!itemRepository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, 
                "Item não encontrado para o ID: " + id
            );
        }
        itemRepository.deleteById(id);
    }
    
    // MÉTODO DE ATUALIZAÇÃO (PUT)
    public Item atualizarItem(Long id, Item itemAtualizado) {
        return itemRepository.findById(id).map(itemExistente -> {
            Long novoUsuarioId = itemAtualizado.getUsuario().getId();
            
            // Lógica para mudar o usuário (se for o caso)
            if (novoUsuarioId != null && !novoUsuarioId.equals(itemExistente.getUsuario().getId())) {
                 Usuario usuarioCompleto = usuarioRepository.findById(novoUsuarioId)
                 		
                 		.orElseThrow(() -> new ResponseStatusException(
                                 HttpStatus.NOT_FOUND, 
                                 "Novo Usuário com ID " + novoUsuarioId + " não encontrado."));
                 itemExistente.setUsuario(usuarioCompleto);
            }
            
            // Atualização dos campos do item
            itemExistente.setNome(itemAtualizado.getNome());
            itemExistente.setDescricao(itemAtualizado.getDescricao());
            itemExistente.setCategoria(itemAtualizado.getCategoria());
            itemExistente.setFotoUrl(itemAtualizado.getFotoUrl());
            itemExistente.setEndereco(itemAtualizado.getEndereco());
            
            return itemRepository.save(itemExistente);
            
            } ).orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, 
            "Item não encontrado para o ID: " + id));
    }
    
    // MÉTODO DE BUSCA POR CATEGORIA (Corrigido)
    public List<Item> buscarPorCategoria(String categoria) {
        // Chama o método que o Spring Data JPA criou no ItemRepository
        return itemRepository.findByCategoriaContainingIgnoreCase(categoria);
    }
}


