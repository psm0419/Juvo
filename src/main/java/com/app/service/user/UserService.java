package com.app.service.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.user.UserDAO;
import com.app.dto.user.User;

public interface UserService {
	public User checkUserLogin(User user);
	public int signupUser(User user); 
	public boolean checkDupId(String id);
	public boolean checkDupNickname(String nickname);
	public User checkUserByToken(String id);
	public int changePassword(User findUser);
	public User findUserById(String id);
	public int changeNickname(User findUser);
	public User findIdByRequest(User requestUser);
	public User resetPasswordRequest(User requestUser);
	public User findByEmail(String email);
	public int insertUser(User user);
	public User findOrCreateGoogleUser(String email, String name);
}
