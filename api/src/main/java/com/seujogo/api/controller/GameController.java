package com.seujogo.api.controller;

import com.seujogo.api.dto.*;
import com.seujogo.api.model.Player;
import com.seujogo.api.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // Todas as rotas aqui começarão com /api
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite chamadas de qualquer origem (seu Unity)
public class GameController {

    private final GameService gameService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Player newPlayer = gameService.registerPlayer(request);
            // Retorna 201 Created
            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body(Map.of("message", "Jogador cadastrado!", "playerId", newPlayer.getId()));
        } catch (RuntimeException e) {
            // Retorna 409 Conflict (se email/user já existir)
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Player player = gameService.loginPlayer(request);
            // Retorna 200 OK
            return ResponseEntity.ok(Map.of("message", "Login efetuado com sucesso!", "playerId", player.getId()));
        } catch (RuntimeException e) {
            // Retorna 401 Unauthorized (senha errada) ou 404 Not Found (email)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/score")
    public ResponseEntity<?> updateScore(@RequestBody ScoreRequest request) {
        try {
            String message = gameService.updateUserScore(request);
            // Retorna 200 OK
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            // Retorna 500 Internal Server Error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "Erro ao atualizar pontuação."));
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        // Retorna 200 OK com a lista do ranking
        return ResponseEntity.ok(gameService.getTop100Leaderboard());
    }
}