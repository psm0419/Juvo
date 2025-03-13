package com.app.dao.membership.impl;

import com.app.dao.membership.MembershipDAO;
import com.app.dto.membership.Membership;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
@Repository
public class MembershipDAOImpl implements MembershipDAO {

	@Autowired
	SqlSessionTemplate sqlSessionTemplate;

	@Override
	public boolean insertMembership(Membership membership) {
		int result = sqlSessionTemplate.insert("membership_mapper.insertMembership", membership);
		if (result == 1) {
			return true;
		} else {
			return false;
		}

	}

	@Override
	public Membership checkMembershipByUserId(String userId) {
		
		return sqlSessionTemplate.selectOne("membership_mapper.checkMembershipByUserId", userId);
	}

	@Override
	public boolean deleteMembership(String userId) {
		int result = sqlSessionTemplate.delete("membership_mapper.deleteMembership", userId);
		if(result == 1) {
			return true;
		} else {
			return false;
		}
		
	}
}