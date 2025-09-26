package com.cmg.comtogether.user.repository;

import com.cmg.comtogether.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySocialId(String socialId);

    @Query("select u from User u " +
            "left join fetch u.interests ui " +
            "left join fetch ui.interest i " +
            "where u.userId = :userId")
    Optional<User> findByIdWithInterests(@Param("userId") Long userId);
}
