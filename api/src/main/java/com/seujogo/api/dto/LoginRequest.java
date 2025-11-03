package com.seujogo.api.dto;

// DTO para receber dados de login
public record LoginRequest(String email, String password) {}