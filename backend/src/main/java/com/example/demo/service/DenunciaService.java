
	package com.example.demo.service;

	import com.example.demo.exception.ResourceNotFoundException;
	import com.example.demo.model.Denuncia;
	import com.example.demo.model.Item;
	import com.example.demo.model.Usuario;
	import com.example.demo.repository.DenunciaRepository;
	import org.springframework.stereotype.Service;
	import org.springframework.transaction.annotation.Transactional;

	@Service
	public class DenunciaService {

	    private final DenunciaRepository denunciaRepository;
	    private final ItemService itemService;
	    private final UsuarioService usuarioService;

	    public DenunciaService(DenunciaRepository denunciaRepository, ItemService itemService, UsuarioService usuarioService) {
	        this.denunciaRepository = denunciaRepository;
	        this.itemService = itemService;
	        this.usuarioService = usuarioService;
	    }

	    @Transactional
	    public Denuncia registrarDenuncia(Long itemId, String motivo, Long denuncianteId) {
	        
	        // 1. Validar Item e Denunciante
	        Item item = itemService.findById(itemId)
	            .orElseThrow(() -> new ResourceNotFoundException("Item não encontrado."));
	        Usuario denunciante = usuarioService.findById(denuncianteId);

	        if (item.getProprietario().getId().equals(denuncianteId)) {
	            throw new IllegalArgumentException("Você não pode denunciar seu próprio item.");
	        }

	        // 2. Criar a Denúncia
	        Denuncia denuncia = new Denuncia();
	        denuncia.setItem(item);
	        denuncia.setDenunciante(denunciante);
	        denuncia.setMotivo(motivo);
	        denuncia.setStatus(Denuncia.StatusDenuncia.PENDENTE);

	        return denunciaRepository.save(denuncia);
	    }
	}

