package com.seujogo.api.dto;

// DTO para receber nova pontuação
public record ScoreRequest(Long playerId, int score) {}