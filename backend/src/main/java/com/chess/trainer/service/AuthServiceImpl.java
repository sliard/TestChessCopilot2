package com.chess.trainer.service;

import com.chess.trainer.dto.request.LoginRequest;
import com.chess.trainer.dto.request.RefreshTokenRequest;
import com.chess.trainer.dto.request.RegisterRequest;
import com.chess.trainer.dto.response.AuthResponse;
import com.chess.trainer.dto.response.UserResponse;
import com.chess.trainer.entity.Role;
import com.chess.trainer.entity.User;
import com.chess.trainer.exception.EmailAlreadyExistsException;
import com.chess.trainer.exception.InvalidCredentialsException;
import com.chess.trainer.exception.ResourceNotFoundException;
import com.chess.trainer.repository.UserRepository;
import com.chess.trainer.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(Role.USER)
                .enabled(true)
                .build();

        userRepository.save(user);

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return new AuthResponse(
                jwtService.generateAccessToken(userDetails),
                jwtService.generateRefreshToken(userDetails),
                jwtService.getAccessExpirationMs()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException();
        }

        var userDetails = userDetailsService.loadUserByUsername(request.email());
        return new AuthResponse(
                jwtService.generateAccessToken(userDetails),
                jwtService.generateRefreshToken(userDetails),
                jwtService.getAccessExpirationMs()
        );
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest request) {
        String email = jwtService.extractEmail(request.refreshToken());
        var userDetails = userDetailsService.loadUserByUsername(email);

        if (!jwtService.isTokenValid(request.refreshToken(), userDetails)) {
            throw new InvalidCredentialsException();
        }

        return new AuthResponse(
                jwtService.generateAccessToken(userDetails),
                jwtService.generateRefreshToken(userDetails),
                jwtService.getAccessExpirationMs()
        );
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
