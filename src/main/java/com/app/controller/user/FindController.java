package com.app.controller.user;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.user.ResetPasswordRequest;
import com.app.dto.user.User;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import com.app.util.SHA256Encryptor;

@RestController
public class FindController {

	@Autowired
	UserService userService;

	@Autowired
	JavaMailSender mailSender;

	// 아이디 찾기
	@PostMapping("/user/findId")
	public User findIdByEmail(HttpServletRequest request, @RequestBody User requestUser) {
		User user = userService.findIdByRequest(requestUser);
		return user;
	}

	// 입력 정보 조회 후 비밀번호 재설정 링크 발송
	@PostMapping("/findPassword/request")
	public boolean resetPasswordRequest(@RequestBody User requestUser, HttpServletRequest request) {
		// 입력정보 조회
		User user = userService.resetPasswordRequest(requestUser);
		
		// 사용자 정보가 없는 경우 즉시 예외 발생
		if (user == null) {
			throw new RuntimeException("입력하신 정보와 일치하는 사용자를 찾을 수 없습니다.");
		}

		try {
			// 토큰 생성
			String token = JwtProvider.createAccessToken(user.getId(),user.getUserType(),user.getNickname());

			// 이메일 설정
			String setFrom = "cording1kyu@gmail.com";
			String toMail = user.getEmail();
			String title = "비밀번호 재설정 링크";
			String resetLink = "http://localhost:3000/resetPassword/" + token;
			String content = "비밀번호를 재설정하려면 아래 링크를 클릭하세요:<br>" +
					"<a href=\"" + resetLink + "\">" + resetLink + "</a><br>" +
					"링크는 1시간 동안 유효합니다.";

			// 이메일 전송
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
			helper.setFrom(setFrom);
			helper.setTo(toMail);
			helper.setSubject(title);
			helper.setText(content, true);
			mailSender.send(message);
			System.out.println("재설정링크 발송 성공");
			return true;
		} catch (Exception e) {
			System.err.println("이메일 전송 실패: " + e.getMessage());
			throw new RuntimeException("이메일 전송에 실패했습니다. 다시 시도해 주세요.");
		}
	}

	@PostMapping("/resetPassword/request")
	public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest request) {
		if (request.getToken() == null || request.getNewPassword() == null) {
			throw new RuntimeException("잘못된 요청입니다.");
		}

		String token = request.getToken();
		String id = JwtProvider.getUserIdFromToken(token); // 토큰에서 id 추출
		
		if (id == null) {
			throw new RuntimeException("유효하지 않은 토큰입니다.");
		}

		String newPassword = request.getNewPassword(); // 새 비밀번호 변수 저장
		User user = userService.findUserById(id); // 추출한 id로 user 조회
		
		if (user == null) {
			throw new RuntimeException("사용자를 찾을 수 없습니다.");
		}

		try {
			String encryptPassword = SHA256Encryptor.encrypt(newPassword); // 암호화
			user.setPw(encryptPassword); // 암호화 비밀번호 새로 user에 저장
			int result = userService.changePassword(user);
			
			if (result != 1) {
				throw new RuntimeException("비밀번호 변경에 실패했습니다.");
			}
			
			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
			
			return ResponseEntity.ok(response);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("비밀번호 암호화 중 오류가 발생했습니다.");
		}
	}
}
