package com.chessot.service;

import com.chessot.dto.request.LoginRequest;
import com.chessot.dto.request.RefreshTokenRequest;
import com.chessot.dto.request.RegisterRequest;
import com.chessot.dto.response.AuthResponse;
import com.chessot.dto.response.UserResponse;

import java.util.UUID;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserResponse getCurrentUser(String email);

    UUID getUserIdByEmail(String email);
}
