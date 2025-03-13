package com.app.service.user.impl;

import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.app.dao.user.UserDAO;
import com.app.dto.user.User;
import com.app.service.user.UserService;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserDAO userDAO;
	
	@Autowired
	RestTemplate restTemplate;
	
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
	
	//관리자	
	
	@Override
	public List<User> findUserList() {
		
		List<User> userList = userDAO.findUserList();

		return userList;
	}

	@Override
	public int removeUser(String id) {
		
		int result  = userDAO.removeUser(id);
		
		return result;
	}

	@Override
	public boolean updateMembership(User user) {

		boolean result = userDAO.updateMembership(user);
		
		if(result == true) {
			return true;
		} else {
			return false;
		}
		
	}

	@Override
	public User handleGoogleLogin(String code) throws Exception {
		if (code == null || code.isEmpty()) {
	        throw new IllegalArgumentException("Google authentication code is missing");
	    }
	    // 1. 구글 액세스 토큰 요청
	    String tokenUrl = "https://oauth2.googleapis.com/token";
	    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
	    params.add("code", code);
	    params.add("client_id", clientId);
	    params.add("client_secret", clientSecret);
	    params.add("redirect_uri", redirectUri);
	    params.add("grant_type", "authorization_code");
	    
	    System.out.println("Request Params:");
	    System.out.println("  Code: " + code);
	    System.out.println("  Client ID: " + clientId);
	    System.out.println("  Client Secret: " + clientSecret);
	    System.out.println("  Redirect URI: " + redirectUri);

	    HttpHeaders headers = new HttpHeaders();
	    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

	    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
	    ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
	    String accessToken = (String) response.getBody().get("access_token");
	    
	    // 2. 구글 사용자 정보 요청
	    String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
	    HttpHeaders userInfoHeaders = new HttpHeaders();
	    userInfoHeaders.setBearerAuth(accessToken);
	    HttpEntity<String> userInfoRequest = new HttpEntity<>(userInfoHeaders);
	    ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoRequest, Map.class);

	    Map<String, Object> userInfo = userInfoResponse.getBody();
	    String email = (String) userInfo.get("email");
	    String name = (String) userInfo.get("name");
	    String googleId = (String) userInfo.get("id"); // 구글 고유 ID

	    // 3. DB에서 사용자 확인 및 저장
	    User user = userDAO.findByEmail(email);
	    if (user == null) {
	        // 신규 사용자면 DB에 저장
	        user = new User();
	        user.setId(googleId); // 구글 ID를 사용자 ID로 사용하거나, 별도 규칙으로 생성
	        user.setEmail(email);
	        user.setUsername(name);
	        user.setUserType("CUS"); // 기본 유저 타입
	        user.setPw(""); // 구글 로그인은 비밀번호 불필요
	        userDAO.insertUser(user);
	    }

	    return user;
	}

	



}
