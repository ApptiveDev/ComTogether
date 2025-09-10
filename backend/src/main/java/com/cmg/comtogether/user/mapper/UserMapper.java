package com.cmg.comtogether.user.mapper;

import com.cmg.comtogether.interest.dto.InterestDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserMapper {
    public UserResponseDto toResponse(User user) {
        List<InterestDto> interests = user.getInterests().stream()
                .map(ui -> InterestDto.builder()
                        .interestId(ui.getInterest().getInterestId())
                        .name(ui.getInterest().getName())
                        .build())
                .toList();

        return UserResponseDto.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .point(user.getPoint())
                .profileImageUrl(user.getProfileImageUrl())
                .interests(interests)
                .build();
    }
}
