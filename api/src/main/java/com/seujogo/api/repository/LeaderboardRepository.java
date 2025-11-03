package com.seujogo.api.repository;

import com.seujogo.api.model.Leaderboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {

    // Verifica se um username já existe
    boolean existsByUsername(String username);

    // Pega os 100 melhores (o Spring cria a query)
    List<Leaderboard> findTop100ByOrderByHighScoreDesc();

    // Esta é a nossa query "mágica" customizada, igual a da solução Node.js/C#
    // Usamos JPQL (parecido com SQL)
    @Modifying // Indica que é uma query de UPDATE/DELETE
    @Query("UPDATE Leaderboard l SET l.highScore = :score, l.lastUpdated = CURRENT_TIMESTAMP " +
           "WHERE l.playerId = :playerId AND :score > l.highScore")
    int updateHighScoreIfGreater(
        @Param("playerId") Long playerId, 
        @Param("score") int score
    );
}