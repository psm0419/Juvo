package com.app.service.membership;

import com.app.dto.membership.Membership;

public interface MembershipService {
    boolean subscribe(Membership membership);
	Membership checkMembershipByUserId(String userId);
	boolean unsubscribe(String userId);
	
}