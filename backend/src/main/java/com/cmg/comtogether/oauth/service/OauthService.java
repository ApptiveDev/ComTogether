package com.cmg.comtogether.oauth.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.common.security.jwt.JwtService;
import com.cmg.comtogether.common.security.jwt.TokenDto;
import com.cmg.comtogether.oauth.dto.KakaoProfileDto;
import com.cmg.comtogether.oauth.dto.OauthLoginResponseDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.SocialType;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.mapper.UserMapper;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OauthService {

    private final KakaoService kakaoService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;

    public OauthLoginResponseDto kakaoLogin(String code) {
        TokenDto kakaoToken = kakaoService.getToken(code);
        KakaoProfileDto profile = kakaoService.getKakaoProfile(kakaoToken.getAccessToken());

        User user = userRepository.findBySocialId(String.valueOf(profile.getId())).orElse(null);
        if (user == null) {
            user = User.builder()
                    .socialId(String.valueOf(profile.getId()))
                    .email(profile.getKakaoAccount().getEmail())
                    .name(profile.getKakaoAccount().getProfile().getNickname())
                    .profileImageUrl(profile.getKakaoAccount().getProfile().getProfileImageUrl())
                    .role(Role.BEGINNER)
                    .socialType(SocialType.KAKAO)
                    .build();
            userRepository.save(user);
        }

        TokenDto token = jwtService.generateToken(user);
        UserResponseDto userDto = userMapper.toResponse(user);

        return OauthLoginResponseDto.builder()
                .user(userDto)
                .token(token)
                .build();
    }
}
