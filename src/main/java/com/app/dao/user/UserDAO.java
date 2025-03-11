package com.app.dao.user;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import com.app.dto.user.User;

public interface UserDAO {

	public User checkUserLogin(User user);
	
	public int signupUser(User user);
	
	public User checkDupId(String id);

	public User checkDupNickname(String nickname);

	public User checkUserByToken(String id);

	public User findUserById(String id);

	public int changePassword(User user);

	public int changeNickname(User user);

	public User findIdRequest(User requestUser);
	
	public User resetPasswordRequest(User requestUser);
	
	public User findByEmail(String email);
	
	public int insertUser(User user);

}
