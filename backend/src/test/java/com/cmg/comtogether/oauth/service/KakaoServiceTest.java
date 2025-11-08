package com.cmg.comtogether.oauth.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.jwt.dto.TokenDto;
import com.cmg.comtogether.oauth.dto.KakaoProfileDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;


@RestClientTest(KakaoService.class)
@Import(RestClientTestConfig.class)
class KakaoServiceTest {

    @Autowired
    private KakaoService kakaoService;

    @Autowired
    private MockRestServiceServer server;

    @BeforeEach
    void setUp(){
        server.reset();
    }

    @Test
    @DisplayName("성공 - 인가코드로 access_token/refresh_token 얻기")
    void getToken_success() {
        // given
        String code = "test-code";
        String responseJson = """
                {
                    "access_token": "access-token",
                    "refresh_token": "refresh-token"
                }
            """;

        String encodedRedirectUri = URLEncoder.encode(
                "http://localhost:3000/oauth/kakao/redirect",
                StandardCharsets.UTF_8
        );

        String expectedForm = "grant_type=authorization_code" +
                "&client_id=test-client-id" +
                "&redirect_uri=" + encodedRedirectUri +
                "&code=" + code;

        server.expect(requestTo("https://kauth.kakao.com/oauth/token"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(content().string(expectedForm))
                .andRespond(withSuccess(responseJson, MediaType.APPLICATION_JSON));

        // when
        TokenDto tokenDto = kakaoService.getToken(code, null);

        // then
        assertThat(tokenDto.getAccessToken()).isEqualTo("access-token");
        assertThat(tokenDto.getRefreshToken()).isEqualTo("refresh-token");
    }

    @Test
    @DisplayName("실패 - 잘못된 인가 코드일 경우 OAUTH_INVALIDE_CODE exception")
    public void getToken_fail_invalidCode() {
        server.expect(requestTo("https://kauth.kakao.com/oauth/token"))
                .andRespond(withStatus(HttpStatus.BAD_REQUEST));

        assertThatThrownBy(() -> kakaoService.getToken("invalid-code", null))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.OAUTH_INVALID_CODE.getMessage());
    }

    @Test
    @DisplayName("실패 - 카카오 서버 오류 OAUTH_PROVIDER_ERROR exception")
    public void getToken_fail_serverError() {
        server.expect(requestTo("https://kauth.kakao.com/oauth/token"))
                .andRespond(withServerError());
        assertThatThrownBy(() -> kakaoService.getToken("any-code", null))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.OAUTH_PROVIDER_ERROR.getMessage());
    }

    @Test
    @DisplayName("성공 - access_token으로 프로필 정보 얻기")
    void getKakaoProfile_success() {
        // given
        String access_token = "test-access-token";
        String responseJson = """
                {
                    "id": 12345,
                    "kakao_account": {
                        "email": "test@example.com",
                        "profile": {
                            "nickname": "test-nickname",
                            "profile_image_url": "test-profile-image-url"
                        }
                    }
                }
            """;

        server.expect(requestTo("https://kapi.kakao.com/v2/user/me"))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer test-access-token"))
                .andRespond(withSuccess(responseJson, MediaType.APPLICATION_JSON));

        // when
        KakaoProfileDto profileDto = kakaoService.getKakaoProfile(access_token);

        // then
        assertThat(profileDto.getId()).isEqualTo(12345);
        assertThat(profileDto.getKakaoAccount().getEmail()).isEqualTo("test@example.com");
        assertThat(profileDto.getKakaoAccount().getProfile().getNickname()).isEqualTo("test-nickname");
        assertThat(profileDto.getKakaoAccount().getProfile().getProfileImageUrl()).isEqualTo("test-profile-image-url");
    }

    @Test
    @DisplayName("실패 - 카카오 서버 오류 OAUTH_PROVIDER_ERROR exception")
    public void getKakaoProfile_fail_serverError() {
        server.expect(requestTo("https://kapi.kakao.com/v2/user/me"))
                .andRespond(withServerError());
        assertThatThrownBy(() -> kakaoService.getKakaoProfile("any-token"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.OAUTH_PROVIDER_ERROR.getMessage());
    }
}