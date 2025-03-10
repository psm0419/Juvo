package com.app.service.user.impl;

import com.app.dao.user.MembershipDAO;
import com.app.dto.user.Membership;
import com.app.service.user.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MembershipServiceImpl implements MembershipService {

    private final MembershipDAO membershipDAO;

    @Override
    @Transactional(readOnly = true)
    public Membership getMembershipInfo(String userId) {
        Membership membership = membershipDAO.getMembershipInfo(userId);
        if (membership == null) {
            membership = new Membership();
            membership.setUser_id(userId);
            membership.setSubscription(0);
            membership.setMonths_subscribed(0);
            membership.setNext_reward_months(0);
        }
        return membership;
    }

    @Override
    @Transactional
    public void subscribe(String userId) {
        Membership existing = membershipDAO.getMembershipInfo(userId);
        if (existing != null && existing.getSubscription() == 1) {
            throw new RuntimeException("이미 구독 중인 사용자입니다.");
        }

        Membership membership = new Membership();
        membership.setUser_id(userId);
        membership.setSubscription(1);
        membership.setMonths_subscribed(0);
        membership.setStart_date(LocalDateTime.now());
        membership.setNext_reward_months(3); // 3개월 후 첫 혜택

        membershipDAO.saveMembership(membership);
    }

    @Override
    @Transactional
    public void unsubscribe(String userId) {
        Membership existing = membershipDAO.getMembershipInfo(userId);
        if (existing == null || existing.getSubscription() == 0) {
            throw new RuntimeException("구독 중이 아닌 사용자입니다.");
        }

        existing.setSubscription(0);
        existing.setNext_reward_months(0);
        membershipDAO.updateMembership(existing);
    }
} 