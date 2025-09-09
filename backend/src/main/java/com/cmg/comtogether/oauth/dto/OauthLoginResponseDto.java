package com.cmg.comtogether.oauth.dto;

import com.cmg.comtogether.common.security.jwt.TokenDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class OauthLoginResponseDto {
    private UserResponseDto user;
    private TokenDto token;
}

