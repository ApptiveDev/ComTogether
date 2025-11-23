package com.cmg.comtogether.product.service;

import com.cmg.comtogether.common.cache.CacheMonitorService;
import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.interest.entity.Interest;
import com.cmg.comtogether.product.dto.NaverProductResponseDto;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.entity.UserInterest;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final UserRepository userRepository;
    private final CacheMonitorService cacheMonitorService;
    private final NaverProductService naverProductService;

    public NaverProductResponseDto searchProducts(String category, String query, int display, int start, String sort, String exclude) {
        String searchQuery = category + " " + query;
        NaverProductResponseDto result = naverProductService.getNaverProducts(searchQuery, display, start, sort, exclude);
        cacheMonitorService.printCacheStats("naverProducts");
        return result;
    }

    public NaverProductResponseDto recommendProducts(Long userId, String category, String query, int display, int start, String sort, String exclude) {
        User user = userRepository.findByIdWithInterests(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String interestString = user.getInterests().stream()
                .map(UserInterest::getInterest)
                .map(Interest::getName)
                .collect(Collectors.joining(" "));
        String searchQuery = category + " " + interestString + query;
        NaverProductResponseDto result = naverProductService.getNaverProducts(searchQuery, display, start, sort, exclude);
        cacheMonitorService.printCacheStats("naverProducts");
        return result;
    }
}
