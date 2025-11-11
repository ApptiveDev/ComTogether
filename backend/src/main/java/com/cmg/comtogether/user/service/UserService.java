package com.cmg.comtogether.user.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.interest.entity.Interest;
import com.cmg.comtogether.interest.service.InterestService;
import com.cmg.comtogether.jwt.dto.TokenDto;
import com.cmg.comtogether.jwt.service.JwtService;
import com.cmg.comtogether.user.dto.UserInitializeRequestDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.mapper.UserMapper;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final InterestService interestService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public void logout(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        jwtService.deleteRefreshToken(userId);
    }

    public UserResponseDto getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDto initializeUser(Long userId, UserInitializeRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.updateRole(requestDto.getRole());

        List<Interest> interests = new ArrayList<>();

        if (requestDto.getInterestIds() != null) {
            interests.addAll(interestService.findAllById(requestDto.getInterestIds()));
        }

        if (requestDto.getCustomInterests() != null) {
            interests.addAll(interestService.saveCustomInterests(requestDto.getCustomInterests()));
        }

        user.updateInterests(interests);

        user.completeInitialization();

        return userMapper.toResponse(user);
    }

    public void deleteUser(User user) {
        Optional<User> deleteUser = userRepository.findById(user.getUserId());
        if (deleteUser.isEmpty()) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }
        userRepository.delete(deleteUser.get());
    }

    @Transactional
    public void deleteAllUsers() {
        userRepository.deleteAllByRoleNot(Role.ADMIN);
    }

    public TokenDto login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_PASSWORD);
        }

        return jwtService.generateToken(user);
    }
}