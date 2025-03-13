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
	public boolean subscribe(Membership membership) {
		boolean result = membershipDAO.insertMembership(membership);
		if (result == true) {
			return true;
		} else {
			return false;
		}

	}

	@Override
	public Membership checkMembershipByUserId(String userId) {
		return membershipDAO.checkMembershipByUserId(userId);
	}
}