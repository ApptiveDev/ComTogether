package com.cmg.comtogether.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    private String productId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String link;

    private String image;

    private Integer lprice;
    private Integer hprice;

    @Column(nullable = false)
    private String mallName;

    @Column(nullable = false)
    private String productType;

    private String maker;
    private String brand;

    private String category1;
    private String category2;
    private String category3;
    private String category4;
}

