package com.cmg.comtogether.product.service;

import com.cmg.comtogether.product.dto.NaverProductResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final RestClient restClient;

    @Value("${naver.shopping.client-id}")
    private String clientId;

    @Value("${naver.shopping.client-secret}")
    private String clientSecret;

    @Value("${naver.shopping.base-url}")
    private String baseUrl;

    public NaverProductResponseDto searchProducts(String category, String query, int display, int start, String sort, String exclude) {
        return restClient.get()
                .uri(UriComponentsBuilder
                        .fromUriString(baseUrl)
                        .queryParam("query", category + " " + query)
                        .queryParam("display", display)
                        .queryParam("start", start)
                        .queryParam("sort", sort)
                        .queryParamIfPresent("exclude", Optional.ofNullable(exclude))
                        .build()
                        .toUri())
                .header("X-Naver-Client-Id", clientId)
                .header("X-Naver-Client-Secret", clientSecret)
                .retrieve()
                .body(NaverProductResponseDto.class);
    }
}
