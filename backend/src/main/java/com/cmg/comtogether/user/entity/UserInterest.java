package com.cmg.comtogether.user.entity;

import com.cmg.comtogether.interest.entity.Interest;
import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userInterestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interest_id", nullable = false)
    private Interest interest;

    public UserInterest(User user, Interest interest) {
        this.user = user;
        this.interest = interest;
    }
}
