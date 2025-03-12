package com.app.service.membership;

import com.app.dto.membership.Membership;

public interface MembershipService {
    void subscribe(Membership membership);
    Membership getMembershipInfo(String userId); // Long → String
}