package com.cmg.comtogether.oauth.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.common.security.jwt.TokenDto;
import com.cmg.comtogether.oauth.dto.KakaoProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final RestClient restClient;

    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String redirectUri;

    @Value("${oauth.kakao.user-info-uri}")
    private String userInfoUri;

    @Value("${oauth.kakao.token-uri}")
    private String tokenUri;

    public TokenDto getToken(String code) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        return restClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(params)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError,
                        (req, res) -> { throw new BusinessException(ErrorCode.OAUTH_INVALID_CODE); })
                .onStatus(HttpStatusCode::is5xxServerError,
                        (req, res) -> { throw new BusinessException(ErrorCode.OAUTH_PROVIDER_ERROR); })
                .body(TokenDto.class);
    }

    public KakaoProfileDto getKakaoProfile(String accessToken) {
        return restClient.get()
                .uri(userInfoUri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .onStatus(HttpStatusCode::is5xxServerError,
                        (req, res) -> { throw new BusinessException(ErrorCode.OAUTH_PROVIDER_ERROR); })
                .body(KakaoProfileDto.class);
    }
}
