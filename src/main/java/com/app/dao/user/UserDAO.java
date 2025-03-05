package com.app.dao.user;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import com.app.dto.user.User;

public interface UserDAO {

	public User checkUserLogin(User user);
	
	public int signupUser(User user);
	
	User checkDupId(String id);
}
