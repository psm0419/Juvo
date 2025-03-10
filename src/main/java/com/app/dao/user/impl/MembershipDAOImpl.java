package com.app.dao.user.impl;

import com.app.dao.user.MembershipDAO;
import com.app.dto.user.Membership;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MembershipDAOImpl implements MembershipDAO {

    private final SqlSessionTemplate sqlSession;

    @Override
    public Membership getMembershipInfo(String userId) {
        return sqlSession.selectOne("membership_mapper.getMembershipInfo", userId);
    }

    @Override
    public void saveMembership(Membership membership) {
        sqlSession.insert("membership_mapper.saveMembership", membership);
    }

    @Override
    public void updateMembership(Membership membership) {
        sqlSession.update("membership_mapper.updateMembership", membership);
    }
} 