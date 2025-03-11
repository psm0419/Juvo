package com.app.controller.user;

import com.app.dto.user.User;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class SocialLoginController {

    @Value("${google.client.id}")
    private String googleClientId;

    @Autowired
    private UserService userService;

    @PostMapping("/google/login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> credential) {
        try {
            JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
            
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), 
                    jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential.get("credential"));
            System.out.println(idToken);
            if (idToken != null) {
                Payload payload = idToken.getPayload();

                // 구글 계정 정보 (필요한 것만 가져오기)
                String email = payload.getEmail();
                boolean emailVerified = payload.getEmailVerified();
                String name = (String) payload.get("name");

                if (!emailVerified) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "이메일 인증이 필요합니다."));
                }

                // 사용자 정보 조회 또는 생성 (pictureUrl 제거)
                User user = userService.findOrCreateGoogleUser(email, name);

                // JWT 토큰 생성
                String accessToken = JwtProvider.createAccessToken(user.getId());
                String refreshToken = JwtProvider.createRefreshToken();

                Map<String, String> tokens = new HashMap<>();
                tokens.put("accessToken", accessToken);
                tokens.put("refreshToken", refreshToken);

                return ResponseEntity.ok(tokens);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "유효하지 않은 Google 토큰입니다."));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Google 로그인 처리 중 오류가 발생했습니다."));
        }
    }
}
