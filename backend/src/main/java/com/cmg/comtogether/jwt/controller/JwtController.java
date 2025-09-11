package com.cmg.comtogether.jwt.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.jwt.dto.TokenDto;
import com.cmg.comtogether.jwt.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class JwtController {

    private final JwtService jwtService;

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenDto>> refresh(@RequestHeader("X-Refresh-Token") String refreshToken) {
        TokenDto tokenDto = jwtService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success(tokenDto));
    }

}
