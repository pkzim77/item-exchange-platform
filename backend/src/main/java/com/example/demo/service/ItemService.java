package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.config.UsuarioDetails;
import com.example.demo.model.Item;
import com.example.demo.model.Usuario;
import com.example.demo.repository.ItemRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ItemService {
	@Autowired
    private ItemRepository itemRepository;
	
	@Autowired
    private UsuarioRepository usuarioRepository;
	
	// Método de Criação (POST)
    public Item save(Item item) {
        // 💡 CORREÇÃO 1: Usar getProprietario() para acessar o ID do dono
        if (item.getProprietario() == null || item.getProprietario().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID do usuário é obrigatório para criar um item.");
        }
        Usuario usuarioCompleto = usuarioRepository.findById(item.getProprietario().getId())
                .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Usuário com ID " + item.getProprietario().getId() + " não encontrado."));
        item.setProprietario(usuarioCompleto); 
        return itemRepository.save(item);
    }

    // Método de Listagem Geral (GET)
    public Page<Item> findAll(Pageable pageable) {
        return itemRepository.findAll(pageable);
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
    	Item item = itemRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado"));

        UsuarioDetails usuarioLogado = (UsuarioDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long usuarioLogadoId = usuarioLogado.getUsuario().getId();

        if (!item.getProprietario().getId().equals(usuarioLogadoId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para deletar este item.");
        }

        itemRepository.deleteById(id);
    }
    

    public Item atualizarItem(Long id, Item itemAtualizado) {
        return itemRepository.findById(id).map(itemExistente -> {
        	 UsuarioDetails usuarioLogado = (UsuarioDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
             Long usuarioLogadoId = usuarioLogado.getUsuario().getId(); 
             Long novoUsuarioId = itemAtualizado.getProprietario().getId();

            if (!itemExistente.getProprietario().getId().equals(usuarioLogadoId)) {
              throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para editar este item.");
            }
            
            // Lógica para mudar o usuário (se for o caso)
            if (novoUsuarioId != null && !novoUsuarioId.equals(itemExistente.getProprietario().getId())) {
                 Usuario usuarioCompleto = usuarioRepository.findById(novoUsuarioId)
                 		
                 		.orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Novo Usuário com ID " + novoUsuarioId + " não encontrado."));
                 itemExistente.setProprietario(usuarioCompleto);
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
    
    public List<Item> buscarPorCategoria(String categoria) {
        return itemRepository.findByCategoriaContainingIgnoreCase(categoria);
    }
}
