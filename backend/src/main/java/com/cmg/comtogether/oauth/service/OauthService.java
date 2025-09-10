package com.cmg.comtogether.oauth.service;

import com.cmg.comtogether.common.security.jwt.entity.RefreshToken;
import com.cmg.comtogether.common.security.jwt.repository.RefreshTokenRepository;
import com.cmg.comtogether.common.security.jwt.service.JwtService;
import com.cmg.comtogether.common.security.jwt.dto.TokenDto;
import com.cmg.comtogether.oauth.dto.KakaoProfileDto;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.SocialType;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.mapper.UserMapper;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OauthService {

    private final KakaoService kakaoService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    public TokenDto kakaoLogin(String code) {
        TokenDto kakaoToken = kakaoService.getToken(code);
        KakaoProfileDto profile = kakaoService.getKakaoProfile(kakaoToken.getAccessToken());

        User user = userRepository.findBySocialId(String.valueOf(profile.getId()))
                .orElseGet(() -> userRepository.save(User.builder()
                        .socialId(String.valueOf(profile.getId()))
                        .email(profile.getKakaoAccount().getEmail())
                        .name(profile.getKakaoAccount().getProfile().getNickname())
                        .profileImageUrl(profile.getKakaoAccount().getProfile().getProfileImageUrl())
                        .role(Role.BEGINNER)
                        .socialType(SocialType.KAKAO)
                        .build()));

        TokenDto token = jwtService.generateToken(user);
        refreshTokenRepository.findByUserId(user.getUserId())
                .ifPresentOrElse(
                        rt -> rt.updateToken(token.getRefreshToken()),
                        () -> refreshTokenRepository.save(new RefreshToken(token.getRefreshToken(), user.getUserId()))
                );

        return TokenDto.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .build();
    }
}
