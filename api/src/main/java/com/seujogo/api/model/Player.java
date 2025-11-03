package com.seujogo.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;

@Entity
@Table(name = "players")
@Data // Anotação do Lombok (cria getters, setters, toString, etc.)
@NoArgsConstructor // Construtor vazio (necessário para o JPA)
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private OffsetDateTime createdAt;

    // Relação Um-para-Um: Um Player tem um Leaderboard
    // 'mappedBy = "player"': Diz ao JPA que a entidade 'Leaderboard' é dona da relação.
    // 'cascade = CascadeType.ALL': Se salvar/deletar um Player, salva/deleta o Leaderboard junto.
    @OneToOne(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Leaderboard leaderboard;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }
}