package com.app.dao.membership;

import com.app.dto.membership.Membership;
import com.app.dto.user.User;

public interface MembershipDAO {
	public  boolean insertMembership(Membership membership);
    public Membership checkMembershipByUserId(String userId);
	boolean deleteMembership(String id);
}