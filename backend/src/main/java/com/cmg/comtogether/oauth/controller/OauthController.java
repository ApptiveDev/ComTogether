package com.cmg.comtogether.oauth.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.jwt.dto.TokenDto;
import com.cmg.comtogether.oauth.dto.OauthLoginRequestDto;
import com.cmg.comtogether.oauth.service.OauthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/oauth/login")
@RequiredArgsConstructor
public class OauthController {

    private final OauthService oauthService;

    @PostMapping("/kakao")
    public ResponseEntity<ApiResponse<TokenDto>> kakaoLogin(@Valid @RequestBody OauthLoginRequestDto requestDto) {
        String code = requestDto.getCode();
        TokenDto tokenDto = oauthService.kakaoLogin(code);
        return ResponseEntity.ok(ApiResponse.success(tokenDto));
    }
}
