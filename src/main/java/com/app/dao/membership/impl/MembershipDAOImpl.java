package com.app.dao.membership.impl;

import com.app.dao.membership.MembershipDAO;
import com.app.dto.membership.Membership;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class MembershipDAOImpl implements MembershipDAO {

    @Autowired
    private SqlSession sqlSession;

    @Override
    public void insertMembership(Membership membership) {
        sqlSession.insert("com.app.mapper.membership.insertMembership", membership);
    }

    @Override
    public Membership getMembershipByUserId(String userId) {
        return sqlSession.selectOne("com.app.mapper.membership.getMembershipByUserId", userId);
    }
}