package com.cmg.comtogether.oauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter @Setter
public class KakaoProfileDto {
    private Long id;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter @Setter
    public static class KakaoAccount {
        private String email;
        private Profile profile;

        @Getter @Setter
        public static class Profile {
            private String nickname;

            @JsonProperty("profile_image_url")
            private String profileImageUrl;
        }
    }
}



