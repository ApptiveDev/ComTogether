package com.cmg.comtogether.user.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.mapper.UserMapper;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public UserResponseDto getUserInfo(User loginUser) {
        User user = userRepository.findById(loginUser.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toResponse(user);
    }
}