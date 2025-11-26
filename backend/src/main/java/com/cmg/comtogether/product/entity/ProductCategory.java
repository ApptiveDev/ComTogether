package com.cmg.comtogether.product.entity;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import lombok.Getter;

@Getter
public enum ProductCategory {
    CPU("CPU", "CPU"),
    MAINBOARD("메인보드", "메인보드"),
    RAM("RAM", "RAM"),
    GRAPHICS_CARD("그래픽카드", "그래픽카드"),
    STORAGE("저장장치", "SSD"),
    POWER_SUPPLY("파워서플라이", "파워서플라이"),
    CASE("케이스", "PC 케이스"),
    COOLER("쿨러/팬", "CPU 쿨러"),
    IO_DEVICE("기타 입출력 장치", "키보드 마우스 모니터 스피커");

    private final String displayName;
    private final String searchQuery;

    ProductCategory(String displayName, String searchQuery) {
        this.displayName = displayName;
        this.searchQuery = searchQuery;
    }

    public static ProductCategory fromDisplayName(String displayName) {
        for (ProductCategory category : values()) {
            if (category.displayName.equals(displayName)) {
                return category;
            }
        }
        throw new BusinessException(ErrorCode.INVALID_PRODUCT_CATEGORY);
    }
}

