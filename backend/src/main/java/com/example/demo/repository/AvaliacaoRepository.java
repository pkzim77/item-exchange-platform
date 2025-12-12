
package com.example.demo.repository;

import com.example.demo.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    Optional<Avaliacao> findByNegociacaoId(Long negociacaoId);

    List<Avaliacao> findByAvaliadoId(Long avaliadoId);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.avaliado.id = :id")
    Double media(@Param("id") Long id);
    
    Optional<Avaliacao> findByNegociacaoIdAndAvaliadorId(Long negociacaoId, Long avaliadorId);
    
    
    
}


	
	

