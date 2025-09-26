package com.cmg.comtogether.interest.service;

import com.cmg.comtogether.interest.dto.InterestDto;
import com.cmg.comtogether.interest.entity.Interest;
import com.cmg.comtogether.interest.repository.InterestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InterestService {

    private final InterestRepository interestRepository;

    public List<InterestDto> getCommonInterests(){
        return interestRepository.findByIsCustomFalse()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<Interest> findAllById(List<Long> ids){
        return interestRepository.findAllById(ids)
                .stream()
                .toList();
    }

    public List<Interest> saveCustomInterests(List<String> interestNames){
        return interestNames.stream()
                .map(interestName -> Interest.builder()
                        .name(interestName)
                        .isCustom(true)
                        .build())
                .map(interestRepository::save)
                .toList();
    }

    private InterestDto toDto(Interest interest) {
        return new InterestDto(interest.getInterestId(), interest.getName());
    }
}
