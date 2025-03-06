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

}
