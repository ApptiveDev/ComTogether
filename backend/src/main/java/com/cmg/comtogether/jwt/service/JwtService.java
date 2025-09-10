package com.cmg.comtogether.common.security.jwt.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.common.security.jwt.entity.RefreshToken;
import com.cmg.comtogether.common.security.jwt.repository.RefreshTokenRepository;
import com.cmg.comtogether.common.security.jwt.util.JwtTokenProvider;
import com.cmg.comtogether.common.security.jwt.dto.TokenDto;
import com.cmg.comtogether.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public TokenDto generateToken(User user) {
        String accessToken = jwtTokenProvider.createAccessToken(user.getUserId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUserId());

        return TokenDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public TokenDto refreshAccessToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        RefreshToken stored = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.UNAUTHORIZED));

        Long userId = jwtTokenProvider.getUserId(refreshToken);
        String newAccessToken = jwtTokenProvider.createAccessToken(userId);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        stored.updateToken(newRefreshToken);
        refreshTokenRepository.save(stored);

        return TokenDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}

