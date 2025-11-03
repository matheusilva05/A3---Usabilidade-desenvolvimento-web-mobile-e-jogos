package com.seujogo.api.dto;

// DTO para receber dados de cadastro
public record RegisterRequest(String email, String password, String username) {}