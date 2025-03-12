package com.app.service.membership.impl;

import com.app.dao.membership.MembershipDAO;
import com.app.dto.membership.Membership;
import com.app.service.membership.MembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MembershipServiceImpl implements MembershipService {

    @Autowired
    private MembershipDAO membershipDAO;

    @Override
    public void subscribe(Membership membership) {
        membershipDAO.insertMembership(membership);
    }

    @Override
    public Membership getMembershipInfo(String userId) {
        return membershipDAO.getMembershipByUserId(userId);
    }
}