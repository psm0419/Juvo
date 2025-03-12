package com.app.dao.membership;

import com.app.dto.membership.Membership;

public interface MembershipDAO {
    void insertMembership(Membership membership);
    Membership getMembershipByUserId(String userId);
}