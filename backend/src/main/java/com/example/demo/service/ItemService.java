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
	
	// Métodos CRUD básicos
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

 
    public List<Item> findAll() {
        return itemRepository.findAll();
    }

    
    public Optional<Item> findById(Long id) {
        return itemRepository.findById(id);
    }

    
    public void delete(Long id) {
        itemRepository.deleteById(id);
    }
}
