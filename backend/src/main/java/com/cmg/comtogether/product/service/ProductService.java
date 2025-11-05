package com.cmg.comtogether.product.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.interest.entity.Interest;
import com.cmg.comtogether.product.dto.NaverProductResponseDto;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.entity.UserInterest;
import com.cmg.comtogether.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final RestClient restClient;
    private final UserRepository userRepository;

    @Value("${naver.shopping.client-id}")
    private String clientId;

    @Value("${naver.shopping.client-secret}")
    private String clientSecret;

    @Value("${naver.shopping.base-url}")
    private String baseUrl;

    public NaverProductResponseDto searchProducts(String category, String query, int display, int start, String sort, String exclude) {
        String searchQuery = category + " " + query;
        return getNaverProducts(searchQuery, display, start, sort, exclude);
    }

    public NaverProductResponseDto recommendProducts(Long userId, String category, String query, int display, int start, String sort, String exclude) {
        User user = userRepository.findByIdWithInterests(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String interestString = user.getInterests().stream()
                .map(UserInterest::getInterest)
                .map(Interest::getName)
                .collect(Collectors.joining(" "));
        String searchQuery = category + " " + interestString + query;
        return getNaverProducts(searchQuery, display, start, sort, exclude);
    }

    @Cacheable(
            value = "naverProducts",
            key = "T(java.util.Objects).hash(#searchQuery, #display, #start, #sort, #exclude)"
    )
    public NaverProductResponseDto getNaverProducts(String searchQuery, int display, int start, String sort, String exclude) {
        return restClient.get()
                .uri(UriComponentsBuilder
                        .fromUriString(baseUrl)
                        .queryParam("query", searchQuery)
                        .queryParam("display", display)
                        .queryParam("start", start)
                        .queryParam("sort", sort)
                        .queryParamIfPresent("exclude", Optional.ofNullable(exclude))
                        .build()
                        .toUri())
                .header("X-Naver-Client-Id", clientId)
                .header("X-Naver-Client-Secret", clientSecret)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                    throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
                })
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    throw new BusinessException(ErrorCode.NAVER_API_ERROR);
                })
                .body(NaverProductResponseDto.class);
    }
}
