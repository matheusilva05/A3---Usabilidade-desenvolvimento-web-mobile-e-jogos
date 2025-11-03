package com.seujogo.api.service;

import com.seujogo.api.dto.*;
import com.seujogo.api.model.Leaderboard;
import com.seujogo.api.model.Player;
import com.seujogo.api.repository.LeaderboardRepository;
import com.seujogo.api.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Injeta dependências (Repositories, Encoder) pelo construtor
public class GameService {

    private final PlayerRepository playerRepository;
    private final LeaderboardRepository leaderboardRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional // Garante que ou tudo (player E leaderboard) é salvo, ou nada é.
    public Player registerPlayer(RegisterRequest request) {
        // 1. Validar se email ou username já existem
        if (playerRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email já está em uso.");
        }
        if (leaderboardRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username já está em uso.");
        }

        // 2. Criar o Player
        Player player = new Player();
        player.setEmail(request.email());
        player.setPasswordHash(passwordEncoder.encode(request.password()));

        // 3. Criar o Leaderboard
        Leaderboard leaderboard = new Leaderboard();
        leaderboard.setUsername(request.username());
        
        // 4. Ligar as duas entidades
        player.setLeaderboard(leaderboard);
        leaderboard.setPlayer(player);

        // 5. Salvar (graças ao CascadeType.ALL, salvar o Player salva o Leaderboard)
        return playerRepository.save(player);
    }

    public Player loginPlayer(LoginRequest request) {
        // 1. Encontrar o player pelo email
        Player player = playerRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Email não encontrado."));

        // 2. Verificar a senha
        if (!passwordEncoder.matches(request.password(), player.getPasswordHash())) {
            throw new RuntimeException("Senha incorreta.");
        }

        return player;
    }

    @Transactional
    public String updateUserScore(ScoreRequest request) {
        // 1. Tenta atualizar usando a query customizada
        int rowsAffected = leaderboardRepository.updateHighScoreIfGreater(
            request.playerId(), 
            request.score()
        );

        // 2. Retorna a mensagem apropriada
        if (rowsAffected > 0) {
            return "Novo recorde salvo!";
        } else {
            return "Pontuação não superou o recorde anterior.";
        }
    }

    public List<LeaderboardEntry> getTop100Leaderboard() {
        // 1. Busca os dados do repositório
        List<Leaderboard> topScores = leaderboardRepository.findTop100ByOrderByHighScoreDesc();

        // 2. Mapeia a Lista de Entidades para uma Lista de DTOs
        return topScores.stream()
                .map(lb -> new LeaderboardEntry(lb.getUsername(), lb.getHighScore()))
                .collect(Collectors.toList());
    }
}