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

    public List<InterestDto> getAllInterest(){
        return interestRepository.findAll()
                .stream()
                .map(interest -> new InterestDto(interest.getInterestId(), interest.getName()))
                .toList();
    }
}
