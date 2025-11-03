package com.seujogo.api.repository;

import com.seujogo.api.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    
    // O Spring cria o SQL automaticamente baseado no nome do método
    Optional<Player> findByEmail(String email);

    // Verifica se um email já existe
    boolean existsByEmail(String email);
}