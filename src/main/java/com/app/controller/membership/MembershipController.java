package com.app.controller.membership;

import com.app.dto.membership.Membership;
import com.app.dto.user.User;
import com.app.service.membership.MembershipService;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class MembershipController {
	Membership membership;
    @Autowired
    private MembershipService membershipService;
    
    @Autowired
    UserService userService;
    
    @PostMapping("/api/membership")
    public ResponseEntity<String> subscribe(@RequestBody Membership membership, HttpServletRequest request) {
    	String token = request.getHeader("Authorization").substring(7);
    	String id = JwtProvider.getUserIdFromToken(token);
    	membership.setUserId(JwtProvider.getUserIdFromToken(token)); //membership table에 id 세팅
    	User user = userService.findUserById(id);
    	
    	user.setMembership(1);  //가입여부 1 == true
    	boolean isSubscribe = userService.updateMembership(user);// user table에 멤버십 가입여부 넣기
   
    	boolean result = membershipService.subscribe(membership); //가입 결과
    	
		return ResponseEntity.ok("멤버십 가입이 완료되었습니다.");
		
    }
//        if (userId == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
//        }
//
//        try {
//            membership.setUserId(userId);
//            membershipService.subscribe(membership);
//            return ResponseEntity.ok("멤버십 가입이 완료되었습니다.");
//        } catch (org.springframework.dao.DataIntegrityViolationException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                                .body("유효하지 않은 사용자 ID입니다. 관리자에게 문의하세요.");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                                .body("멤버십 가입 중 오류가 발생했습니다: " + e.getMessage());
//        }
		
		@GetMapping("/api/membershipCheck") 
		public Membership checkMembership (HttpServletRequest request ) {
			String token = request.getHeader("Authorization").substring(7);
	    	String userId = JwtProvider.getUserIdFromToken(token);
	    	
	    	
	    	Membership membership = membershipService.checkMembershipByUserId(userId);
	    	System.out.println(membership);
		return	membership;
		}
		
		@PostMapping("/api/membership/unsubscribe")
	    public ResponseEntity<String> unsubscribe(@RequestBody Membership membership, HttpServletRequest request) {
	    	String token = request.getHeader("Authorization").substring(7);
	    	String id = JwtProvider.getUserIdFromToken(token);
	    	membership.setUserId(JwtProvider.getUserIdFromToken(token)); //membership table에 id 세팅
	    	User user = userService.findUserById(id);
	    	
	    	user.setMembership(0);  //가입여부 0 == false
	    	boolean isSubscribe = userService.updateMembership(user);// user table에 멤버십 가입여부 넣기
	   
	    	boolean result = membershipService.unsubscribe(user.getId()); //가입 결과
	    	if(result == true) {
	    		return ResponseEntity.ok("멤버십 해지가 완료되었습니다.");
	    	} else {
	    		
	    	}	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("해지가 완료되지 않았습니다. 관리자에게 문의하세요.");
			
			
	    }
		
    }
