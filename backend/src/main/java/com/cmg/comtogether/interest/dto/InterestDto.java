package com.cmg.comtogether.interest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class InterestDto {
    private Long interestId;
    private String name;
}
