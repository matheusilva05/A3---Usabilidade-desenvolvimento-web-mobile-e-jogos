package com.seujogo.api.dto;

// DTO para enviar os dados do ranking
public record LeaderboardEntry(String username, int highScore) {}