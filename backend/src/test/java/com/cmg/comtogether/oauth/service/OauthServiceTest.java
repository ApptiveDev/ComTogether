package com.cmg.comtogether.oauth.service;

import com.cmg.comtogether.jwt.dto.TokenDto;
import com.cmg.comtogether.oauth.dto.KakaoProfileDto;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.SocialType;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@SpringBootTest
@Transactional
class OauthServiceTest {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OauthService oauthService;
    
    @MockitoBean
    private KakaoService kakaoService;

    private final String code = "auth-code";

    private TokenDto createKakaoToken() {
        return TokenDto.builder()
                .accessToken("kakao-access-token")
                .refreshToken("kakao-refresh-token")
                .build();
    }

    private KakaoProfileDto createKakaoProfile(Long id, String email, String nickname, String imageUrl) {
        return KakaoProfileDto.builder()
                .id(id)
                .kakaoAccount(
                        KakaoProfileDto.KakaoAccount.builder()
                                .email(email)
                                .profile(
                                        KakaoProfileDto.KakaoAccount.Profile.builder()
                                                .nickname(nickname)
                                                .profileImageUrl(imageUrl)
                                                .build()
                                )
                                .build()
                )
                .build();
    }

    @Test
    @DisplayName("성공 - 신규회원일 경우 DB에 저장 후 JWT 발급")
    void kakaoLogin_success_newUser() {
        // given
        given(kakaoService.getToken(code, null)).willReturn(createKakaoToken());
        given(kakaoService.getKakaoProfile("kakao-access-token"))
                .willReturn(createKakaoProfile(12345L, "new@example.com", "new-user", "img-url"));

        // when
        TokenDto tokenDto = oauthService.kakaoLogin(code, null);

        // then
        assertThat(tokenDto.getAccessToken()).isNotBlank();
        assertThat(tokenDto.getRefreshToken()).isNotBlank();

        Optional<User> saved = userRepository.findBySocialId("12345");
        assertThat(saved).isPresent();
        assertThat(saved.get().getEmail()).isEqualTo("new@example.com");

        verify(kakaoService).getToken(code, null);
        verify(kakaoService).getKakaoProfile("kakao-access-token");
    }

    @Test
    @DisplayName("성공 - 기존회원일 경우 JWT만 발급")
    void kakaoLogin_success_existingUser() {
        // given
        User existingUser = User.builder()
                .role(Role.BEGINNER)
                .socialId("12345")
                .socialType(SocialType.KAKAO)
                .email("exist@example.com")
                .name("exist-user")
                .profileImageUrl("exist-img")
                .build();
        userRepository.save(existingUser);

        given(kakaoService.getToken(code, null)).willReturn(createKakaoToken());
        given(kakaoService.getKakaoProfile("kakao-access-token"))
                .willReturn(createKakaoProfile(12345L, "exist@example.com", "exist-user", "exist-img"));

        // when
        TokenDto tokenDto = oauthService.kakaoLogin(code, null);

        // then
        assertThat(tokenDto.getAccessToken()).isNotBlank();
        assertThat(tokenDto.getRefreshToken()).isNotBlank();

        Optional<User> found = userRepository.findBySocialId("12345");
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("exist@example.com");

        verify(kakaoService).getToken(code, null);
        verify(kakaoService).getKakaoProfile("kakao-access-token");
    }
}