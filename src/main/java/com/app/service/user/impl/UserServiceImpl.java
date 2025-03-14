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

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

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
            userDAO.insertUser(user);
        }

        return user;
    }
}