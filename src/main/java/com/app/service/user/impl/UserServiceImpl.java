package com.app.service.user.impl;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.app.dao.user.UserDAO;
import com.app.dto.user.User;
import com.app.service.user.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@PropertySource(value = { "classpath:application.properties" })
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDAO userDAO;
    //구글
    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;
    
    //네이버
    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    @Value("${naver.redirect-uri}")
    private String naverRedirectUri;

    @Value("${naver.token-url}")
    private String naverTokenUrl;

    @Value("${naver.user-info-url}")
    private String naverUserInfoUrl;
    
    @Value("${kakao.client-id}") private String kakaoClientId;
    @Value("${kakao.redirect-uri}") private String kakaoRedirectUri;
    @Value("${kakao.token-url}") private String kakaoTokenUrl;
    @Value("${kakao.user-info-url}") private String kakaoUserInfoUrl;

    @Override
    public User checkUserLogin(User user) {
        return userDAO.checkUserLogin(user);
    }

    @Override
    public int signupUser(User user) {
        return userDAO.signupUser(user);
    }

    @Override
    public boolean checkDupId(String id) {
        return userDAO.checkDupId(id) != null;
    }
    
    @Override
    public boolean checkDupEmail(String email) {
        return userDAO.checkDupEmail(email) != null;
    }

    @Override
    public boolean checkDupNickname(String nickname) {
        return userDAO.checkDupNickname(nickname) != null;
    }

    @Override
    public User checkUserByToken(String id) {
        return userDAO.checkUserByToken(id);
    }

    @Override
    public int changePassword(User user) {
        return userDAO.changePassword(user);
    }

    @Override
    public User findUserById(String id) {
        return userDAO.findUserById(id);
    }

    @Override
    public int changeNickname(User user) {
        return userDAO.changeNickname(user);
    }
    
   

    @Override
    public User findIdByRequest(User requestUser) {
        return userDAO.findIdRequest(requestUser);
    }

    @Override
    public User resetPasswordRequest(User requestUser) {
        return userDAO.resetPasswordRequest(requestUser);
    }

    @Override
    public User findByEmail(String email) {
        return userDAO.findByEmail(email);
    }

    @Override
    public int insertUser(User user) {
        return userDAO.insertUser(user);
    }

    @Transactional
    @Override
    public User findOrCreateGoogleUser(String email, String name) {
        User user = userDAO.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(name);

            String randomId = email.split("@")[0] + "_" + String.format("%04d", new Random().nextInt(10000));
            user.setId(randomId);

            userDAO.insertUser(user);
        }
        return user;
    }

    // 관리자
    @Override
    public List<User> findUserList() {
        List<User> userList = userDAO.findUserList();
        return userList;
    }

    @Override
    public int removeUser(String id) {
        int result = userDAO.removeUser(id);
        return result;
    }

    @Override
    public boolean updateMembership(User user) {
        boolean result = userDAO.updateMembership(user);
        return result;
    }

    @Override
    public User handleGoogleLogin(Map<String, String> requestBody) throws Exception {
        String code = requestBody.get("code");
        if (code == null || code.isEmpty()) {
            System.out.println("구글 로그인 시도 - Authorization code: " + code);
            throw new IllegalArgumentException("Authorization code is missing");
        }

        System.out.println("Processing authorization code: " + code);

        if (clientId == null || clientId.isEmpty() || clientSecret == null || clientSecret.isEmpty()) {
            throw new IllegalStateException("Google client ID or secret is not configured. Check application.properties");
        }

        // Google OAuth 2.0 토큰 엔드포인트로 code 교환
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response;
        try {
            response = restTemplate.exchange(
                "https://oauth2.googleapis.com/token",
                HttpMethod.POST,
                entity,
                Map.class
            );
        } catch (Exception e) {
            System.err.println("Error exchanging code for token: " + e.getMessage());
            throw new IllegalStateException("Failed to exchange authorization code for token", e);
        }

        Map<String, Object> tokenResponse = response.getBody();
        if (tokenResponse == null || tokenResponse.get("id_token") == null) {
            System.err.println("Token response: " + tokenResponse);
            throw new IllegalArgumentException("ID token not found in token response");
        }

        String idToken = (String) tokenResponse.get("id_token");
        System.out.println("ID token received: " + idToken);

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken googleIdToken;
        try {
            googleIdToken = verifier.verify(idToken);
        } catch (GeneralSecurityException | IOException e) {
            System.err.println("Error verifying ID token: " + e.getMessage());
            throw new IllegalArgumentException("Failed to verify ID token", e);
        }

        if (googleIdToken == null) {
            throw new IllegalArgumentException("Invalid ID token: Verification failed");
        }

        GoogleIdToken.Payload payload = googleIdToken.getPayload();
        System.out.println("ID Token Payload: " + payload.toString());

        String email = payload.getEmail();
        String name = (String) payload.get("name");        
        String googleId = payload.getSubject();

        System.out.println("Google User Info - Email: " + email + ", Name: " + name + ", Google ID: " + googleId);

        User user = userDAO.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setId(googleId);
            user.setEmail(email);
            user.setUsername(name);            
            user.setUserType("CUS");            
            user.setPw("");
            String randomNickname = generateRandomNickname();
            user.setNickname(randomNickname);
            
            userDAO.insertUser(user);
        }

        return user;
    }
    private String generateRandomNickname() {
        String prefix = "User"; // 고정 접두사
        Random random = new Random();
        int randomNum = random.nextInt(9000) + 1000; // 1000~9999 사이의 숫자 생성
        String nickname = prefix + randomNum; // 예: "User1234"

        return nickname;
    }
    @Override
    public User handleNaverLogin(Map<String, String> requestBody) throws Exception {
        System.out.println("네이버 로그인 처리 시작 - 요청 데이터: " + requestBody);

        String code = requestBody.get("code");
        if (code == null || code.isEmpty()) {
            System.out.println("WARNING: Authorization code가 누락됨");
            throw new IllegalArgumentException("Authorization code is missing");
        }

        System.out.println("DEBUG: Authorization code: " + code);

        // 네이버 토큰 교환
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", naverClientId);
        params.add("client_secret", naverClientSecret);
        params.add("code", code);
        params.add("redirect_uri", naverRedirectUri);

        System.out.println("DEBUG: 네이버 토큰 요청 파라미터: " + params);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            naverTokenUrl,
            HttpMethod.POST,
            entity,
            Map.class
        );

        Map<String, Object> tokenResponse = response.getBody();
        System.out.println("DEBUG: 네이버 토큰 응답: " + tokenResponse);

        if (tokenResponse == null || tokenResponse.get("access_token") == null) {
            System.out.println("WARNING: 네이버 토큰 획득 실패 - 응답: " + tokenResponse);
            throw new IllegalArgumentException("Failed to obtain access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");
        System.out.println("INFO: 네이버 access token 획득 성공: " + accessToken);

        // 네이버 사용자 정보 조회
        headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> userInfoEntity = new HttpEntity<>(headers);

        System.out.println("DEBUG: 네이버 사용자 정보 요청 - URL: " + naverUserInfoUrl);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
            naverUserInfoUrl,
            HttpMethod.GET,
            userInfoEntity,
            Map.class
        );

        Map<String, Object> userInfo = userInfoResponse.getBody();
        System.out.println("DEBUG: 네이버 사용자 정보 응답: " + userInfo);

        if (userInfo == null || userInfo.get("response") == null) {
            System.out.println("WARNING: 네이버 사용자 정보 조회 실패 - 응답: " + userInfo);
            throw new IllegalArgumentException("Failed to retrieve user info");
        }

        Map<String, Object> responseData = (Map<String, Object>) userInfo.get("response");
        String naverId = (String) responseData.get("id");
        String email = (String) responseData.get("email");
        String name = (String) responseData.get("name");
        String nickName = (String) responseData.get("nickname");
        String mobile = (String) responseData.get("mobile");
        
        System.out.println("INFO: 네이버 사용자 정보 - ID: " + naverId + ", Email: " + email + ", Name: " + name);

        // 사용자 확인 및 생성
        User user = userDAO.findByEmail(email);
        if (user == null) {
            System.out.println("INFO: 새로운 네이버 사용자 - DB에 등록 시작");
            user = new User();
            user.setId(naverId);
            user.setEmail(email);
            user.setUsername(name);
            user.setNickname(nickName);
            user.setUserType("CUS");
            user.setPw(""); // 소셜 로그인 사용자는 비밀번호 없음
            if (mobile != null) {
                user.setTel(mobile.replaceAll("-", "")); // 하이픈 제거 후 tel에 설정
            } else {
                user.setTel(null); // mobile이 없으면 null로 설정
            }
            try {
                userDAO.insertUser(user);
                System.out.println("INFO: 새로운 네이버 사용자 등록 완료 - ID: " + naverId);
            } catch (Exception e) {
                System.err.println("ERROR: DB 삽입 중 오류 발생 - " + e.getMessage());
                e.printStackTrace();
                throw e; // 예외를 상위로 전파하여 디버깅 가능
            }
        } else {
            System.out.println("INFO: 기존 네이버 사용자 - ID: " + user.getId() + ", Email: " + user.getEmail());
        }

        System.out.println("INFO: 네이버 로그인 처리 완료 - 반환 사용자: " + user);
        return user;
    }

	
    @Override
    public User handleKakaoLogin(Map<String, String> requestBody) throws Exception {
        System.out.println("카카오 로그인 처리 시작 - 요청 데이터: " + requestBody);

        String code = requestBody.get("code");
        if (code == null || code.isEmpty()) {
            System.out.println("WARNING: Authorization code가 누락됨");
            throw new IllegalArgumentException("Authorization code is missing");
        }

        System.out.println("DEBUG: Authorization code: " + code);

        // 카카오 토큰 교환
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);

        System.out.println("DEBUG: 카카오 토큰 요청 파라미터: " + params);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
            kakaoTokenUrl,
            HttpMethod.POST,
            entity,
            Map.class
        );

        Map<String, Object> tokenResponse = response.getBody();
        System.out.println("DEBUG: 카카오 토큰 응답: " + tokenResponse);

        if (tokenResponse == null || tokenResponse.get("access_token") == null) {
            System.out.println("WARNING: 카카오 토큰 획득 실패 - 응답: " + tokenResponse);
            throw new IllegalArgumentException("Failed to obtain access token");
        }

        String accessToken = (String) tokenResponse.get("access_token");
        System.out.println("INFO: 카카오 access token 획득 성공: " + accessToken);

        // 카카오 사용자 정보 조회
        headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> userInfoEntity = new HttpEntity<>(headers);

        System.out.println("DEBUG: 카카오 사용자 정보 요청 - URL: " + kakaoUserInfoUrl);
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
            kakaoUserInfoUrl,
            HttpMethod.GET,
            userInfoEntity,
            Map.class
        );

        Map<String, Object> userInfo = userInfoResponse.getBody();
        System.out.println("DEBUG: 카카오 사용자 정보 응답: " + userInfo);

        if (userInfo == null) {
            System.out.println("WARNING: 카카오 사용자 정보 조회 실패");
            throw new IllegalArgumentException("Failed to retrieve user info");
        }

        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        String kakaoId = String.valueOf(userInfo.get("id"));
        String email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
        String nickname = profile != null ? (String) profile.get("nickname") : null;
        
        System.out.println("INFO: 카카오 사용자 정보 - ID: " + kakaoId + ", Email: " + email + ", Nickname: " + nickname);

        // 사용자 확인 및 생성
        User user = kakaoId != null ? userDAO.checkDupId(kakaoId) : null;
        if (user == null) {
            System.out.println("INFO: 새로운 카카오 사용자 - DB에 등록 시작");
            user = new User();
            user.setId(kakaoId);
            user.setEmail(email); // email은 null일 수 있음
            user.setNickname(nickname);
            user.setUserType("CUS");
            user.setPw(""); // 소셜 로그인 사용자는 비밀번호 없음
            
            userDAO.insertUser(user);
            System.out.println("INFO: 새로운 카카오 사용자 등록 완료 - ID: " + kakaoId);
        } else {
            System.out.println("INFO: 기존 카카오 사용자 - ID: " + user.getId() + ", Email: " + user.getEmail());
        }

        System.out.println("INFO: 카카오 로그인 처리 완료 - 반환 사용자: " + user);
        return user;
    }
}