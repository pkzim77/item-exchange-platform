
package com.example.demo.repository;

import com.example.demo.model.Negociacao;
import com.example.demo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

	@Repository
	public interface NegociacaoRepository extends JpaRepository<Negociacao, Long> {

	  
	    List<Negociacao> findByCompradorOrItemProprietario(Usuario comprador, Usuario proprietario);

	    
	    long countByItemIdAndStatus(Long itemId, Negociacao.StatusNegociacao status);
	}

