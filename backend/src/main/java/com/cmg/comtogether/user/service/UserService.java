package com.cmg.comtogether.user.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.interest.entity.Interest;
import com.cmg.comtogether.interest.repository.InterestRepository;
import com.cmg.comtogether.user.dto.UserInitializeRequestDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.mapper.UserMapper;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final InterestRepository interestRepository;

    public UserResponseDto getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDto initializeUser(Long userId, UserInitializeRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        log.info("requestDto: {}", requestDto);
        user.updateRole(requestDto.getRole());

        if (requestDto.getInterestIds() != null) {
            List<Interest> interests = interestRepository.findAllById(requestDto.getInterestIds());
            user.updateInterests(interests);
        }

        return userMapper.toResponse(user);
    }
}