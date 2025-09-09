package com.cmg.comtogether.oauth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OauthLoginRequestDto {

    @NotBlank(message = "인가 코드는 필수 값입니다.")
    private String code;
}
