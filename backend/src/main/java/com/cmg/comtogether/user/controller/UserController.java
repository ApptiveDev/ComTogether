package com.cmg.comtogether.user.controller;

import com.cmg.comtogether.common.response.ApiResponse;
import com.cmg.comtogether.common.security.CustomUserDetails;
import com.cmg.comtogether.user.dto.UserInitializeRequestDto;
import com.cmg.comtogether.user.dto.UserResponseDto;
import com.cmg.comtogether.user.entity.User;
import com.cmg.comtogether.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userDetails.getUser();
        log.info("Response: {}", user.getUserId());
        UserResponseDto userResponseDto = userService.getUserInfo(user.getUserId());
        return ResponseEntity.ok(ApiResponse.success(userResponseDto));
    }

    @PutMapping("/initialize")
    public ResponseEntity<ApiResponse<UserResponseDto>> initializeUser(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UserInitializeRequestDto request
    ) {
        UserResponseDto userResponseDto = userService.initializeUser(userDetails.getUser().getUserId(), request);
        return ResponseEntity.ok(ApiResponse.success(userResponseDto));
    }
}
