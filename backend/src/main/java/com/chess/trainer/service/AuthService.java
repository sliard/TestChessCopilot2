package com.chess.trainer.service;

import com.chess.trainer.dto.request.LoginRequest;
import com.chess.trainer.dto.request.RefreshTokenRequest;
import com.chess.trainer.dto.request.RegisterRequest;
import com.chess.trainer.dto.response.AuthResponse;
import com.chess.trainer.dto.response.UserResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshTokenRequest request);

    UserResponse getCurrentUser(String email);
}
