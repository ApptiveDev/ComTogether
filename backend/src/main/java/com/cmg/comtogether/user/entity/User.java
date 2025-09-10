package com.cmg.comtogether.user.entity;

import com.cmg.comtogether.interest.entity.Interest;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.BEGINNER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SocialType socialType;

    @Column(nullable = false, unique = true)
    private String socialId;

    private Integer point;

    private String profileImageUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<UserInterest> interests = new HashSet<>();;

    public void updateRole(Role role) {
        this.role = role;
    }

    public void updateInterests(List<Interest> newInterests) {
        this.interests.clear();
        for (Interest interest : newInterests) {
            this.interests.add(new UserInterest(this, interest));
        }
    }
}
