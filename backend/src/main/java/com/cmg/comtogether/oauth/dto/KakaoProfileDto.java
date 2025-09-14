package com.cmg.comtogether.oauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Builder
public class KakaoProfileDto {
    private Long id;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Builder
    @Getter
    public static class KakaoAccount {
        private String email;
        private Profile profile;

        @Builder
        @Getter
        public static class Profile {
            private String nickname;

            @JsonProperty("profile_image_url")
            private String profileImageUrl;
        }
    }
}



