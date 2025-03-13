package com.app.controller.user;

import com.app.dto.user.User;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login/auth2")
public class SocialLoginController {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, String> getKakaoToken(String code) {
        Map<String, String> responseMap = new HashMap<>();

        try {
            String tokenUrl = "https://kauth.kakao.com/oauth/token";

            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // 요청 바디 설정
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "authorization_code");
            body.add("client_id", "38efa586e068f1d6b2ad94f405e175cc");
            body.add("redirect_uri", "http://localhost:3000/login/auth2/code/kakao");
            body.add("code", code);
           

            // HTTP 요청 보내기
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> tokenResponse = response.getBody();
                String accessToken = (String) tokenResponse.get("access_token");
                String refreshToken = (String) tokenResponse.get("refresh_token");

                responseMap.put("access_token", accessToken);
                responseMap.put("refresh_token", refreshToken);
                responseMap.put("message", "로그인 성공");
            } else {
                responseMap.put("error", "Kakao로부터 토큰 가져오기 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            responseMap.put("error", "예외 발생: " + e.getMessage());
        }

        return responseMap;
    }
}