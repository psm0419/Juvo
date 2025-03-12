package com.app.controller.membership;

import com.app.dto.membership.Membership;
import com.app.service.membership.MembershipService;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    @Autowired
    private MembershipService membershipService;

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody Membership membership, HttpSession session) {
        String userId = (String) session.getAttribute("userId"); // Long → String으로 변경
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        try {
            membership.setUserId(userId);
            membershipService.subscribe(membership);
            return ResponseEntity.ok("멤버십 가입이 완료되었습니다.");
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("유효하지 않은 사용자 ID입니다. 관리자에게 문의하세요.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("멤버십 가입 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}