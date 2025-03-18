package com.app.service.user;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.user.UserDAO;
import com.app.dto.user.User;

public interface UserService {
	public User checkUserLogin(User user);
	public int signupUser(User user); 
	public boolean checkDupId(String id);
	public boolean checkDupNickname(String nickname);
	public boolean checkDupEmail(String email);
	public User checkUserByToken(String id);
	public int changePassword(User findUser);
	public User findUserById(String id);
	public int changeNickname(User findUser);
	public User findIdByRequest(User requestUser);
	public User resetPasswordRequest(User requestUser);
	public User findByEmail(String email);
	public int insertUser(User user);
	public User findOrCreateGoogleUser(String email, String name);
	
	//	관리자
	public List<User> findUserList();
	//modifyUser
	public int removeUser(String id);
	public boolean updateMembership(User user);
	
	// 구글 로그인용 메서드 추가
	User handleGoogleLogin(Map<String, String> requestBody) throws Exception;
	User handleNaverLogin(Map<String, String> requestBody) throws Exception;
	
}
