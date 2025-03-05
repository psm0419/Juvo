package com.app.controller.user;

import java.util.Random;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.user.User;

@RestController
public class AuthController {
	@Autowired
	JavaMailSenderImpl mailSender;
	
	@PostMapping("/auth/email")
	public String authEmail(@RequestBody User user, HttpServletRequest request) {
		// 난수의 범위 111111 ~ 999999 (6자리 난수)
					Random random = new Random();
					int checkNum = random.nextInt(888888) + 111111;

					// 이메일 보낼 양식
					String setFrom = "cording1kyu@gmail.com"; // 2단계 인증 x, 메일 설정에서 POP/IMAP 사용 설정에서 POP/SMTP 사용함으로 설정o
					String toMail = user.getEmail();
					String title = "비밀번호 찾기 인증 이메일 입니다.";
					String content = "인증 코드는 " + checkNum + " 입니다." + "<br>" + "해당 인증 코드를 인증 코드 확인란에 기입하여 주세요.";

					// 인증번호 발신
					try {
						MimeMessage message = mailSender.createMimeMessage();
						MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
						helper.setFrom(setFrom);
						helper.setTo(toMail);
						helper.setSubject(title);
						helper.setText(content, true);
						mailSender.send(message);
					} catch (Exception e) {
						e.printStackTrace();
					}
					System.out.println("랜덤숫자 : " + checkNum);

					String code = checkNum + "";
		return code;
	}
}
