package com.app.service.user.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import com.app.dao.user.UserDAO;
import com.app.dto.user.User;
import com.app.service.user.UserService;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserDAO userDAO;
	
	@Override
	public User checkUserLogin(User user) {
		User loginUser = userDAO.checkUserLogin(user);
		return loginUser;
	}

	@Override
	public int signupUser(User user) {
		int result = userDAO.signupUser(user);
		return result;
	}

}
