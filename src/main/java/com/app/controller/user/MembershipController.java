package com.app.controller.user;

import com.app.dto.user.Membership;
import com.app.service.user.MembershipService;
import com.app.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;
    private final JwtUtil jwtUtil;

    @GetMapping("")
    public ResponseEntity<Membership> getMembershipInfo(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.extractUsername(token.substring(7));
        return ResponseEntity.ok(membershipService.getMembershipInfo(userId));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.extractUsername(token.substring(7));
        membershipService.subscribe(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.extractUsername(token.substring(7));
        membershipService.unsubscribe(userId);
        return ResponseEntity.ok().build();
    }
} 