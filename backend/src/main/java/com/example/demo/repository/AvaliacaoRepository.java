
	package com.example.demo.repository;

	import com.example.demo.model.Avaliacao;
	import org.springframework.data.jpa.repository.JpaRepository;
	import org.springframework.data.jpa.repository.Query;
	import org.springframework.data.repository.query.Param;
	import org.springframework.stereotype.Repository;

	import java.util.Optional;

	@Repository
	public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

	    Optional<Avaliacao> findByNegociacaoId(Long negociacaoId);

	    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.avaliado.id = :usuarioId")
	    Double calcularMediaAvaliacoesPorUsuario(@Param("usuarioId") Long usuarioId);

	}

