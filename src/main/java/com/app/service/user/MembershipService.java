package com.app.service.user;

import com.app.dto.user.Membership;

public interface MembershipService {
    Membership getMembershipInfo(String userId);
    void subscribe(String userId);
    void unsubscribe(String userId);
} 