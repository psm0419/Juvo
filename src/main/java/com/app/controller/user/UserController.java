package com.app.controller.user;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.user.User;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import com.app.util.LoginManager;
import com.app.util.SHA256Encryptor;

@RestController
public class UserController {

	@Autowired
	UserService userService;



	@PostMapping("/user/loginJWT") // 로그인 시 토큰 발급
	public Map<String, String> loginJWT(@RequestBody User user, HttpServletRequest request) {
		System.out.println("로그인 시도 : " + user.getId());

		try {
			user.setPw(SHA256Encryptor.encrypt(user.getPw()));
			System.out.println(user.getPw());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		User loginUser = userService.checkUserLogin(user);

		Map<String, String> tokens = new HashMap<>();
		if (loginUser == null) { // 로그인 실패
			System.out.println("로그인 실패");
			tokens.put("accessToken", "fail");
		} else { // 로그인 성공
			String accessToken = JwtProvider.createAccessToken(user.getId(),user.getUserType());
			String refreshToken = JwtProvider.createRefreshToken();
			System.out.println("로그인 아이디 : " + user.getId());
			System.out.println("발행 access Token : " + accessToken);
			System.out.println("발행 refresh Token : " + refreshToken);

			tokens.put("accessToken", accessToken);
			tokens.put("refreshToken", refreshToken);
		}
		return tokens;
	}

	@PostMapping("/user/loginCheckJWT")
	public String loginCheckJWT(@RequestBody User user, HttpServletRequest request) {

		// token 열어보고 -> 유효한 토큰인지 -> 누가 로그인했는지 -> 로직실행(DB정보조회) -> return
		String accessToken = JwtProvider.extractToken(request);
		if (accessToken == null) { // 인증없음!
			return "no"; // ApiResponse
		}
		System.out.println("accessToken : " + accessToken);
		System.out.println(JwtProvider.isVaildToken(accessToken));
		if (JwtProvider.isVaildToken(accessToken)) {
			String userId = JwtProvider.getUserIdFromToken(accessToken);
			System.out.println("토큰에 들어있는 id : " + userId);
		}
		return "ok";
	}

	@PostMapping("/user/signup") // 회원가입 요청
	public String signup(@RequestBody User user, HttpServletRequest request) {

		user.setUserType("CUS");

		try {
			String encryptPw = SHA256Encryptor.encrypt(user.getPw());
			user.setPw(encryptPw);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		System.out.println(user);

		int result = userService.signupUser(user);
		if (result == 1) {
			System.out.println("회원가입 성공");
			return "회원가입 성공";
		} else {
			System.out.println("회원가입 실패");
			return "회원가입 실패";
		}

	}

	@PostMapping("/user/checkDupId") // ID 중복 확인
	public boolean checkDupId(@RequestBody User user, HttpServletRequest request) {
		System.out.println(user.getId());
		boolean checkDupId = userService.checkDupId(user.getId()); // 중복 체크 -> DB
		if (checkDupId == true) {
			return false;
		} else {
			return true;
		}
	}

	@PostMapping("/user/checkDupNickname") // 닉네임 중복 확인
	public boolean checkDupNickname(@RequestBody String nickname, HttpServletRequest request) {

		boolean checkDupNickname = userService.checkDupNickname(nickname); // 중복 체크 -> DB
		if (checkDupNickname == true) {
			return false;
		} else {
			return true;
		}
	}

	@GetMapping("/user/checkUserByToken")
	public User checkUserByToken(HttpServletRequest request) {
		String token = JwtProvider.extractToken(request);
		String id = JwtProvider.getUserIdFromToken(token);
		User user = userService.checkUserByToken(id);
		user.setPw("");// 비밀번호 비워서 보내기
		return user;
	}

	@PostMapping("/user/changePassword")
	public boolean changePassword(@RequestBody User changeData, HttpServletRequest request) {

		// 유효성 검증
		String token = JwtProvider.extractToken(request);
		if (token == null || !JwtProvider.isVaildToken(token)) {
			System.out.println("유효하지 않은 토큰");
			return false; // 또는 예외 던지기
		}

		String userId = JwtProvider.getUserIdFromToken(token);

		if (!userId.equals(changeData.getId())) {
			System.out.println("토큰의 사용자 ID와 요청 ID가 일치하지 않음");
			return false;
		}

		// 기능

		String newPw = changeData.getPw(); // 새로운 변수에 변경 할 비밀번호 저장
		User findUser = userService.findUserById(changeData.getId()); // request 받은 id로 해당 계정 조회

		try {
			findUser.setPw(SHA256Encryptor.encrypt(newPw)); // 새로운 비밀번호 암호화 후 조회한 계정에 저장
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return false;
		}

		int result = userService.changePassword(findUser); // 변경 결과 성공=1

		System.out.println(result);
		if (result == 1) {
			System.out.println("비밀번호 변경 성공");
			return true;
		} else {
			System.out.println("비밀번호 변경 실패");
			return false;

		}
	}

	@PostMapping("/user/changeNickname")
	public boolean changeNickname(@RequestBody User changeData, HttpServletRequest request) {

		// 유효성 검증
		String token = JwtProvider.extractToken(request);
		if (token == null || !JwtProvider.isVaildToken(token)) {
			System.out.println("유효하지 않은 토큰");
			return false; // 또는 예외 던지기
		}

		String userId = JwtProvider.getUserIdFromToken(token);

		if (!userId.equals(changeData.getId())) {
			System.out.println("토큰의 사용자 ID와 요청 ID가 일치하지 않음");
			return false;
		}

		// 기능

		String newNickname = changeData.getNickname(); // 새로운 변수에 변경 할 비밀번호 저장
		User findUser = userService.findUserById(changeData.getId()); // request 받은 id로 해당 계정 조회

		findUser.setNickname(newNickname); // 새로운 닉네임 조회한 계정에 저장

		int result = userService.changeNickname(findUser); // 변경 결과 성공=1

		System.out.println(result);
		if (result == 1) {
			System.out.println("닉네임 변경 성공");
			return true;
		} else {
			System.out.println("닉네임 변경 실패");
			return false;

		}
	}

	@PostMapping("/user/refreshToken")
	public ResponseEntity<Map<String, String>> refreshAccessToken(@RequestHeader("Authorization") String refreshToken) {
		String token = refreshToken.replace("Bearer ", "");
		String userId = JwtProvider.getUserIdFromToken(token);
		String userType = JwtProvider.getUserTypeFromToken(token);
		String newAccessToken = JwtProvider.refreshAccessToken(token, userId, userType );

		if (newAccessToken != null) {
			Map<String, String> tokens = new HashMap<>();
			tokens.put("accessToken", newAccessToken);
			return ResponseEntity.ok(tokens);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		}
	}
}
