package com.cmg.comtogether.user.dto;

import com.cmg.comtogether.user.entity.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class UserInitializeRequestDto {

    @NotBlank
    private Role role;

    @JsonProperty("interest_ids")
    private List<Long> interestIds;
}
