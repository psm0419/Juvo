package com.app.controller.user;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.user.User;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import com.app.util.LoginManager;


@RestController
public class UserController {
	
	@Autowired
	UserService userService ;
	
	@PostMapping("/user/loginJWT")
	public String loginJWT(@RequestBody User user, HttpServletRequest request) {
		//member 값 DB 비교
		System.out.println("requestbody" + user);
		
		User loginUser = userService.checkUserLogin(user);
		
		try {
			if(loginUser.getId().equals(user.getId()) && loginUser.getPw().equals(user.getPw())) {
				String accessToken = JwtProvider.createAccessToken(user.getId());
				System.out.println("로그인 아이디 : " + user.getId());
				System.out.println("발행 access Token : " + accessToken);
				return accessToken;
			} else {
				System.out.println("로그인 실패");
				return "fail";
			}
		} catch(NullPointerException e) {
			System.out.println("로그인 정보가 다릅니다");
			return "fail";
		} 		
	}
	
	@PostMapping("/user/signup")
	public String signup(@RequestBody User user, HttpServletRequest request) {
		System.out.println(user);
		int result = userService.signupUser(user);
		if(result == 1) {
			System.out.println("회원가입 성공");
			return "회원가입 성공";
		} else {
			System.out.println("회원가입 실패");
			return "회원가입 실패";
		}
		
	}
}
