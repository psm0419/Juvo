package com.app.service.user.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.user.UserDAO;
import com.app.dto.user.User;
import com.app.service.user.UserService;

import java.util.Random;

@Service
public class UserServiceImpl implements UserService{

	@Autowired
	UserDAO userDAO;
	
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

	



}
