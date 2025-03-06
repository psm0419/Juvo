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
	
}
