package com.app.dao.user;

import com.app.dto.user.Membership;

public interface MembershipDAO {
    Membership getMembershipInfo(String userId);
    void saveMembership(Membership membership);
    void updateMembership(Membership membership);
} 