package com.cmg.comtogether.guide.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.guide.dto.Description;
import com.cmg.comtogether.guide.dto.GuideResponseDto;
import com.cmg.comtogether.guide.entity.Guide;
import com.cmg.comtogether.guide.repository.GuideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GuideService {

    private final GuideRepository guideRepository;

    public GuideResponseDto getGuide(String category) {
        Guide guide = guideRepository.findByCategory(category)
                .orElseThrow(() -> new BusinessException(ErrorCode.GUIDE_NOT_FOUND));

        return GuideResponseDto.builder()
                .category(guide.getCategory())
                .description(
                    Description.builder()
                            .intro(guide.getIntro())
                            .detail(guide.getDetail())
                            .caution(guide.getCaution())
                            .beginner(guide.getBeginner())
                            .build()
                )
                .build();
    }
}