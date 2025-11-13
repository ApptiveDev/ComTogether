package com.cmg.comtogether.quote.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "quote_items")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuoteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long quoteItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quote_id", nullable = false)
    private Quote quote;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false)
    private Integer lprice;

    private Integer hprice;

    private String image;

    @Column(nullable = false, length = 1000)
    private String link;

    @Column(nullable = false)
    private String mallName;

    private String productType;

    private String maker;

    private String brand;

    // 네이버 쇼핑 카테고리(대분류~세분류)
    private String category1;
    private String category2;
    private String category3;
    private String category4;

    @Builder.Default
    @Column(nullable = false)
    private Integer quantity = 1;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public QuoteItem(Quote quote, Long productId, String title, Integer lprice, Integer hprice,
                     String image, String link, String mallName, String productType,
                     String maker, String brand, String category1, String category2,
                     String category3, String category4, Integer quantity) {
        this.quote = quote;
        this.productId = productId;
        this.title = title;
        this.lprice = lprice;
        this.hprice = hprice;
        this.image = image;
        this.link = link;
        this.mallName = mallName;
        this.productType = productType;
        this.maker = maker;
        this.brand = brand;
        this.category1 = category1;
        this.category2 = category2;
        this.category3 = category3;
        this.category4 = category4;
        this.quantity = quantity == null ? 1 : quantity;
        this.createdAt = LocalDateTime.now();
    }

    public void increaseQuantity(int amount) {
        if (amount <= 0) {
            return;
        }
        this.quantity = (this.quantity == null ? 0 : this.quantity) + amount;
        if (this.quote != null) {
            this.quote.touch();
        }
    }

    public void updateDetails(Long productId, String title, Integer lprice, Integer hprice,
                              String image, String link, String mallName, String productType,
                              String maker, String brand, String category1, String category2,
                              String category3, String category4) {
        this.productId = productId;
        this.title = title;
        this.lprice = lprice;
        this.hprice = hprice;
        this.image = image;
        this.link = link;
        this.mallName = mallName;
        this.productType = productType;
        this.maker = maker;
        this.brand = brand;
        this.category1 = category1;
        this.category2 = category2;
        this.category3 = category3;
        this.category4 = category4;
        if (this.quote != null) {
            this.quote.touch();
        }
    }

    public Integer getQuantity() {
        return quantity == null ? 1 : quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity == null ? 1 : quantity;
        if (this.quote != null) {
            this.quote.touch();
        }
    }
}

