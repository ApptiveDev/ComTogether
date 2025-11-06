package com.cmg.comtogether.guide.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class Description {
    private String intro;
    private String detail;
    private String caution;
    private String beginner;
}
