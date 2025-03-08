package com.app.controller.user;

import java.security.NoSuchAlgorithmException;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
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
	
	@PostMapping("/user/findId")
	public User findIdByEmail (HttpServletRequest request, @RequestBody User requestUser) {
		System.out.println(requestUser);
		User user = userService.findIdByEmail(requestUser);
		return user;
	}
	
	// 입력 정보 조회 후 재설정 링크 발송
	@PostMapping("/findPassword/request") 
	public String sendResetPasswordEmail (@RequestBody User requestUser, HttpServletRequest request) {
		User user = userService.resetPasswordByEmail(requestUser);
		
		 // 토큰 생성 (예: UUID 또는 랜덤 문자열)
			// String token = java.util.UUID.randomUUID().toString();
		 String token = JwtProvider.createAccessToken(user.getId());

        // DB에 토큰 저장 (유효 기간 설정 포함, 별도 구현 필요)
        //saveResetToken(user.getId(), token);

        // 이메일 설정
        String setFrom = "cording1kyu@gmail.com";
        String toMail = user.getEmail();
        String title = "비밀번호 재설정 링크";
        String resetLink = "http://localhost:3000/resetPassword/" + token; // 프론트엔드 경로
        String content = "비밀번호를 재설정하려면 아래 링크를 클릭하세요:<br>" +
                         "<a href=\"" + resetLink + "\">" + resetLink + "</a><br>" +
                         "링크는 1시간 동안 유효합니다.";

        // 이메일 전송
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
            helper.setFrom(setFrom);
            helper.setTo(toMail);
            helper.setSubject(title);
            helper.setText(content, true); // HTML 형식으로 전송
            mailSender.send(message);
            System.out.println("재설정링크 발송 성공");
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이메일 전송 실패");
        }
	return "ok";
	}
	
	
	
	@PostMapping("/resetPassword/request") 
	public String resetPassword (@RequestBody ResetPasswordRequest request) {
		String token = request.getToken();
		String id = JwtProvider.getUserIdFromToken(token); // 토큰에서 id 추출
		String newPassword = request.getNewPassword(); //새 비밀번호 변수 저장
		User user = userService.findUserById(id); // 추출한 id로 user 조회
		System.out.println(user);
		
		try {
			String encryptPassword = SHA256Encryptor.encrypt(newPassword); // 암호화
			user.setPw(encryptPassword); // 암호화 비밀번호 새로 user에 저장
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		int result = userService.changePassword(user);
		System.out.println(user);
		return "ok";
	}
}
