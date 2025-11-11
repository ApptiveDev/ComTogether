package com.cmg.comtogether.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginRequestDto {

    @Email
    @NotBlank(message = "이메일은 필수 값 입니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 값 입니다.")
    private String password;
}
