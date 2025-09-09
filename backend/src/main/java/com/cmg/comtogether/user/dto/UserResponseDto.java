package com.cmg.comtogether.user.dto;

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
    private String role;
    private Integer point;
    private String profileImageUrl;
    private List<String> interests;
}

