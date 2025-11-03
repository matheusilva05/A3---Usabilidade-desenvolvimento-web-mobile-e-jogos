package com.seujogo.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Entity
@Table(name = "leaderboard")
@Data
@NoArgsConstructor
public class Leaderboard {

    @Id
    // Esta coluna NÃO é auto-gerada. Ela usa o ID do Player.
    @Column(name = "player_id")
    private Long playerId;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "high_score", nullable = false)
    private int highScore = 0;

    @Column(name = "last_updated")
    private OffsetDateTime lastUpdated;

    // Esta é a mágica para a relação Um-para-Um com Chave Primária Compartilhada
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Diz ao JPA que o 'id' desta entidade é mapeado pelo 'player'
    @JoinColumn(name = "player_id")
    private Player player;
}