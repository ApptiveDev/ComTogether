package com.cmg.comtogether.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInterestInitializeDto {

    @JsonProperty("interest_ids")
    private List<Long> interestIds;

    @JsonProperty("custom_interests")
    private List<String> customInterests;
}
