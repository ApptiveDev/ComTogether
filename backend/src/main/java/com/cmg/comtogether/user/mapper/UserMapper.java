package com.cmg.comtogether.user.mapper;

import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDto toResponse(User user) {
        return UserResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .point(user.getPoint())
                .profileImageUrl(user.getProfileImageUrl())
                .interests(
                        user.getInterests().stream()
                                .map(ui -> ui.getInterest().getName())
                                .toList()
                )
                .build();
    }
}
