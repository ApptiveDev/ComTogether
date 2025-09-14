package com.cmg.comtogether.user.service;

import com.cmg.comtogether.common.exception.BusinessException;
import com.cmg.comtogether.common.exception.ErrorCode;
import com.cmg.comtogether.interest.dto.InterestDto;
import com.cmg.comtogether.user.dto.UserInitializeRequestDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.Role;
import com.cmg.comtogether.user.entity.SocialType;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class UserServiceTest {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    private User createUser() {
        User user = User.builder()
                .name("test")
                .socialId("test-social-id")
                .socialType(SocialType.KAKAO)
                .email("test@example.com")
                .role(Role.BEGINNER)
                .build();
        return userRepository.save(user);
    }

    @Test
    @DisplayName("성공 - 유저 정보 조회")
    void getUserInfo_success() {
        // given
        User user = createUser();

        // when
        UserResponseDto response = userService.getUserInfo(user.getUserId());

        // then
        assertThat(response.getUserId()).isEqualTo(user.getUserId());
        assertThat(response.getName()).isEqualTo("test");
        assertThat(response.getRole()).isEqualTo(Role.BEGINNER);
    }

    @Test
    @DisplayName("실패 - 존재하지 않는 유저 예외 발생")
    void getUserInfo_fail_notfound() {
        assertThatThrownBy(() -> userService.getUserInfo(999L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining(ErrorCode.USER_NOT_FOUND.getMessage());
    }

    @Test
    @DisplayName("성공 - 유저 초기화 성공 (관심사 포함)")
    void initializeUser_success() {
        // given
        User user = createUser();

        UserInitializeRequestDto requestDto = UserInitializeRequestDto.builder()
                .role(Role.EXPERT)
                .interestIds(List.of(1L, 2L))
                .build();

        // when
        UserResponseDto response = userService.initializeUser(user.getUserId(), requestDto);

        // then
        assertThat(response.getRole()).isEqualTo(Role.EXPERT);
        assertThat(response.getInterests().stream()
                .map(InterestDto::getName)
                .toList()
        ).containsExactlyInAnyOrder("3D", "디자인");
    }
}