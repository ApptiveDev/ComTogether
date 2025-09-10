package com.cmg.comtogether.interest.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.interest.dto.InterestDto;
import com.cmg.comtogether.interest.entity.Interest;
import com.cmg.comtogether.interest.service.InterestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/interests")
public class InterestController {

    private final InterestService interestService;

    @GetMapping
    private ResponseEntity<ApiResponse<List<InterestDto>>> getInterests() {
        List<InterestDto> allInterest = interestService.getAllInterest();
        return ResponseEntity.ok(ApiResponse.success(allInterest));
    }
}
