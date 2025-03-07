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

	@Override
	public boolean checkDupId(String id) {
		User checkDupId = userDAO.checkDupId(id);
		System.out.println(checkDupId);
		if(checkDupId == null) {	//객체가 없다 -> 중복X
			return false;
		} else { //해당 아이디와 동일한 객체가 있다 -> 중복O
			return true;
		}
	}

	@Override
	public boolean checkDupNickname(String nickname) {
		User checkDupNickname = userDAO.checkDupNickname(nickname);
		System.out.println(checkDupNickname);
		if(checkDupNickname == null) {	//객체가 없다 -> 중복X
			return false;
		} else { //해당 아이디와 동일한 객체가 있다 -> 중복O
			return true;
		}
	}

	@Override
	public User checkUserByToken(String id) {
		User user = userDAO.checkUserByToken(id);
		return user;
	}

	@Override
	public int changePassword(User user) {
		int result = userDAO.changePassword(user);
		return result;
	}

	@Override
	public User findUserById(String id) {
		User user = userDAO.findUserById(id);
		return user;
	}

	@Override
	public int changeNickname(User user) {
		int result = userDAO.changeNickname(user);
		return result;
	}



}
