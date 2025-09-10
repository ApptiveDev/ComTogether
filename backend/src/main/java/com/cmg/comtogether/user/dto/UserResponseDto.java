package com.cmg.comtogether.user.dto;

import com.cmg.comtogether.interest.dto.InterestDto;
import com.cmg.comtogether.user.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class UserResponseDto {
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private Integer point;
    private String profileImageUrl;
    private List<InterestDto> interests;
}

