package com.chess.trainer.repository;

import com.chess.trainer.config.JpaAuditingConfig;
import com.chess.trainer.entity.Role;
import com.chess.trainer.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers(disabledWithoutDocker = true)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(JpaAuditingConfig.class)
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // Ensure Flyway runs migrations on the Testcontainers DB
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired
    private UserRepository userRepository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        savedUser = userRepository.save(User.builder()
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .build());
    }

    @Test
    @DisplayName("should find by email when user exists")
    void should_findByEmail_when_userExists() {
        // Arrange — user saved in setUp

        // Act
        Optional<User> result = userRepository.findByEmail("test@example.com");

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("test@example.com");
        assertThat(result.get().getFirstName()).isEqualTo("John");
        assertThat(result.get().getLastName()).isEqualTo("Doe");
        assertThat(result.get().getRole()).isEqualTo(Role.USER);
        assertThat(result.get().getId()).isNotNull();
    }

    @Test
    @DisplayName("should return empty when email not found")
    void should_returnEmpty_when_emailNotFound() {
        // Arrange — no user with this email

        // Act
        Optional<User> result = userRepository.findByEmail("unknown@example.com");

        // Assert
        assertThat(result).isEmpty();
    }

    @Test
    @DisplayName("should return true when email exists")
    void should_returnTrue_when_emailExists() {
        // Arrange — user saved in setUp

        // Act
        boolean exists = userRepository.existsByEmail("test@example.com");

        // Assert
        assertThat(exists).isTrue();
    }

    @Test
    @DisplayName("should return false when email not exists")
    void should_returnFalse_when_emailNotExists() {
        // Arrange — no user with this email

        // Act
        boolean exists = userRepository.existsByEmail("unknown@example.com");

        // Assert
        assertThat(exists).isFalse();
    }

    @Test
    @DisplayName("should save user when valid entity")
    void should_saveUser_when_validEntity() {
        // Arrange
        User newUser = User.builder()
                .email("newuser@example.com")
                .password("encodedPassword")
                .firstName("Jane")
                .lastName("Smith")
                .role(Role.USER)
                .enabled(true)
                .build();

        // Act
        User result = userRepository.save(newUser);

        // Assert
        assertThat(result.getId()).isNotNull();
        assertThat(result.getEmail()).isEqualTo("newuser@example.com");
        assertThat(result.getFirstName()).isEqualTo("Jane");
        assertThat(result.getCreatedAt()).isNotNull();
        assertThat(result.getUpdatedAt()).isNotNull();

        // Verify it persisted
        assertThat(userRepository.findByEmail("newuser@example.com")).isPresent();
    }
}
