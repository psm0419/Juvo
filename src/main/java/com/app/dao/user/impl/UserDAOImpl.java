package com.app.dao.user.impl;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.user.UserDAO;
import com.app.dto.user.User;

@Repository
public class UserDAOImpl implements UserDAO {
	@Autowired
	SqlSessionTemplate sqlSessionTemplate;

	@Override
	public User checkUserLogin(User user) {
		User loginUser = sqlSessionTemplate.selectOne("user_mapper.checkUserLogin", user);
		return loginUser;
	}

	@Override
	public int signupUser(User user) {
		int result = sqlSessionTemplate.insert("user_mapper.signupUser", user);
		return result;
	}

	@Override
	public User checkDupId(String id) {
		User checkDupId = sqlSessionTemplate.selectOne("user_mapper.checkDupId", id);
		System.out.println(checkDupId);
		return checkDupId;
	}

	@Override
	public User checkDupNickname(String nickname) {
		User checkDupNickname = sqlSessionTemplate.selectOne("user_mapper.checkDupNickname", nickname);
		System.out.println(checkDupNickname);
		return checkDupNickname;
	}

	@Override
	public User checkUserByToken(String id) {
		User user = sqlSessionTemplate.selectOne("user_mapper.checkUserByToken",id);
		return user;
	}

	@Override
	public User findUserById(String id) {
		User user = sqlSessionTemplate.selectOne("user_mapper.findUserById", id);
		return user;
	}

	@Override
	public int changePassword(User user) {
		int result = sqlSessionTemplate.update("user_mapper.changePassword", user);
		System.out.println();
		return result;
	}

	@Override
	public int changeNickname(User user) {
		int result = sqlSessionTemplate.update("user_mapper.changeNickname", user);
		System.out.println();
		return result;
	}

	@Override
	public User findIdRequest(User requestUser) {
		User user = sqlSessionTemplate.selectOne("user_mapper.findIdRequest", requestUser);
		return user;
	}

	@Override
	public User resetPasswordRequest(User requestUser) {
		User user = sqlSessionTemplate.selectOne("user_mapper.resetPasswordRequest", requestUser);
		
		return user;
	}

	@Override
	public User findByEmail(String email) {
		return sqlSessionTemplate.selectOne("user_mapper.findByEmail", email);
	}

	@Override
	public int insertUser(User user) {
		return sqlSessionTemplate.insert("user_mapper.insertUser", user);
	}
}
