package com.cmg.comtogether.product.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.oauth.service.KakaoService;
import com.cmg.comtogether.oauth.service.RestClientTestConfig;
import com.cmg.comtogether.product.dto.NaverProductResponseDto;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJson;
import org.springframework.boot.test.autoconfigure.web.client.RestClientTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

import java.net.URLEncoder;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@RestClientTest(ProductService.class)
@Import(RestClientTestConfig.class)
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    MockRestServiceServer server;

    @BeforeEach
    void setUp(){
        server.reset();
    }

    @Test
    @DisplayName("성공 - 상품 조회")
    void searchProducts_success() {
        // given
        String responseJson = """
                {
                    "lastBuildDate": "Wed, 17 Sep 2025 20:28:28 +0900",
                    "total": 2923,
                    "start": 1,
                    "display": 2,
                    "items": [
                        {
                            "title": "<b>게이밍</b> 조립PC 롤 발로란트 오버워치2 로블록스 <b>게임용</b> 주식용 <b>디자인</b>용 윈도우11",
                            "link": "https://smartstore.naver.com/main/products/2342929542",
                            "image": "https://shopping-phinf.pstatic.net/main_1288794/12887948127.10.jpg",
                            "lprice": "299000",
                            "hprice": "",
                            "mall_name": "리뉴올PC PC노리",
                            "product_id": "12887948127",
                            "product_type": "5",
                            "brand": "인텔",
                            "maker": "인텔",
                            "category1": "디지털/가전",
                            "category2": "PC",
                            "category3": "조립/베어본PC",
                            "category4": ""
                        },
                        {
                            "title": "14700KF RTX 5080 <b>게이밍 디자인</b> 작업 조립PC 본체 데스크탑 모니터 풀세트",
                            "link": "https://smartstore.naver.com/main/products/554477632",
                            "image": "https://shopping-phinf.pstatic.net/main_1063091/10630916988.16.jpg",
                            "lprice": "3419000",
                            "hprice": "",
                            "mall_name": "엘리트피씨",
                            "product_id": "10630916988",
                            "product_type": "2",
                            "brand": "",
                            "maker": "",
                            "category1": "디지털/가전",
                            "category2": "PC",
                            "category3": "조립/베어본PC",
                            "category4": ""
                        }
                    ]
                }
                """;

        server.expect(requestTo(Matchers.containsString("https://openapi.naver.com/v1/search/shop.json")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(responseJson, MediaType.APPLICATION_JSON));

        // when
        NaverProductResponseDto result = productService.searchProducts("CPU", "게이밍", 2, 1, "sim", null);

        // then
        assertNotNull(result);
        assertEquals(1, result.getStart());
        assertEquals(2, result.getDisplay());
        assertEquals(2, result.getItems().size());
    }

    @Test
    @DisplayName("실패 - 카카오 서버 오류 NAVER_API_ERROR exception")
    public void searchProduces_fail_serverError() {
        server.expect(requestTo(org.hamcrest.Matchers.containsString("https://openapi.naver.com/v1/search/shop.json")))
                .andRespond(withServerError());

        assertThatThrownBy(() ->
                productService.searchProducts("CPU", "게임", 2, 1, "sim", null))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.NAVER_API_ERROR.getMessage());
    }
}