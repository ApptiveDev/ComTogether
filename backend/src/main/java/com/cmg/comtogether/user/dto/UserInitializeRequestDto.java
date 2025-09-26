package com.cmg.comtogether.user.dto;

import com.cmg.comtogether.user.entity.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInitializeRequestDto {

    @NotNull(message = "역할(role)은 필수 값입니다.")
    private Role role;

    @JsonProperty("interest_ids")
    private List<Long> interestIds;

    @JsonProperty("custom_interests")
    private List<String> customInterests;
}
