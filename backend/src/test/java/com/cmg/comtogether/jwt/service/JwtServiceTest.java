package com.cmg.comtogether.jwt.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.jwt.dto.TokenDto;
import com.cmg.comtogether.jwt.entity.RefreshToken;
import com.cmg.comtogether.jwt.repository.RefreshTokenRepository;
import com.cmg.comtogether.jwt.util.JwtTokenProvider;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.SocialType;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private UserRepository userRepository;

    private User createUser() {
        User user = User.builder()
                .name("jwt-test")
                .email("jwt@example.com")
                .socialId("jwt-social-id")
                .socialType(SocialType.KAKAO)
                .role(Role.BEGINNER)
                .build();
        return userRepository.save(user);
    }

    @Test
    @DisplayName("성공 - 새 유저 토큰 발급 & RefreshToken 저장")
    void generateToken_success_newUser() {
        // given
        User user = createUser();

        // when
        TokenDto tokenDto = jwtService.generateToken(user);

        // then
        assertThat(tokenDto.getAccessToken()).isNotBlank();
        assertThat(tokenDto.getRefreshToken()).isNotBlank();

        Optional<RefreshToken> saved = refreshTokenRepository.findByUserId(user.getUserId());
        assertThat(saved).isPresent();
        assertThat(saved.get().getRefreshToken()).isEqualTo(tokenDto.getRefreshToken());
    }

    @Test
    @DisplayName("성공 - 기존 유저 RefreshToken 업데이트")
    void generateToken_success_existingUser() {
        // given
        User user = createUser();
        RefreshToken oldToken = refreshTokenRepository.save(new RefreshToken("old-refresh", user.getUserId()));

        // when
        TokenDto tokenDto = jwtService.generateToken(user);

        // then
        RefreshToken updated = refreshTokenRepository.findByUserId(user.getUserId()).orElseThrow();
        assertThat(updated.getId()).isEqualTo(oldToken.getId());
        assertThat(updated.getRefreshToken()).isEqualTo(tokenDto.getRefreshToken());
    }

    @Test
    @DisplayName("성공 - RefreshToken으로 Access/Refresh 재발급")
    void refreshAccessToken_success() {
        // given
        User user = createUser();
        TokenDto initial = jwtService.generateToken(user);

        String oldRefresh = initial.getRefreshToken();

        // when
        TokenDto refreshed = jwtService.refreshAccessToken(oldRefresh);

        // then
        assertThat(refreshed.getAccessToken()).isNotBlank();
        assertThat(refreshed.getRefreshToken()).isNotEqualTo(oldRefresh);

        RefreshToken stored = refreshTokenRepository.findByUserId(user.getUserId()).orElseThrow();
        assertThat(stored.getRefreshToken()).isEqualTo(refreshed.getRefreshToken());
    }

    @Test
    @DisplayName("실패 - DB에 없는 RefreshToken, UNAUTHORIZED 예외 발생")
    void refreshAccessToken_fail_notFound() {
        String invalidToken = jwtTokenProvider.createRefreshToken(999L);

        assertThatThrownBy(() -> jwtService.refreshAccessToken(invalidToken))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.UNAUTHORIZED.getMessage());
    }
}