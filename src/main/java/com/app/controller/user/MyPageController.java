package com.app.controller.user;

import com.app.dto.juyuso.Juyuso;
import com.app.dto.membership.Membership;
import com.app.dto.user.User;
import com.app.service.juyuso.JuyusoService;
import com.app.service.membership.MembershipService;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

@RestController
public class MyPageController {

	@Autowired
	JuyusoService juyusoService;

	@Autowired
	UserService userService;

	@Autowired
	MembershipService membershipService;
	
	@GetMapping("/favorites/station") // 마이페이지 내 즐겨찾기 한 주유소 목
	public List<Juyuso> getFavoriteStations(@RequestHeader("Authorization") String token) {
		String extractToken = token.substring(7);
		String userId = JwtProvider.getUserIdFromToken(extractToken);
		List<String> favoriteIds = juyusoService.getFavoritesJuyuso(userId);
		System.out.println(favoriteIds);
		List<Juyuso> favoriteStations = new ArrayList<>();
		for (String id : favoriteIds) {
			Juyuso station = juyusoService.getJuyusoById(id);
			System.out.println(station);
			if (station != null) {
				favoriteStations.add(station);
			}
		}
		return favoriteStations;
	}

	@PostMapping("/favorites/station/remove")
	public ResponseEntity<?> removeFavoriteStation(
			@RequestBody Map<String, String> request,
			@RequestHeader("Authorization") String token) {
		try {
			String extractToken = token.substring(7);
			String userId = JwtProvider.getUserIdFromToken(extractToken);
			String uniId = request.get("uniId");
			
			boolean result = juyusoService.deleteFavoriteStation(userId, uniId);
			
			if (result) {
				return ResponseEntity.ok().body("즐겨찾기가 해제되었습니다.");
			} else {
				return ResponseEntity.badRequest().body("즐겨찾기 해제에 실패했습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							   .body("서버 오류가 발생했습니다.");
		}
	}
	
	@PostMapping("/api/mypage/removeUser")
	public  String removeUser(@RequestBody User user) {
		String id = user.getId();
		Membership membership = membershipService.checkMembershipByUserId(id);
	
		if (membership != null) {
			try {
				int result = userService.removeUser(id);
				boolean deleteMembership = membershipService.unsubscribe(id);
				System.out.println("membership 같이 삭제");
				if (result > 0 && (deleteMembership == true) ) {
					System.out.println("User deleted: " + id);
					return "success";
				} else {
					System.out.println("User not found: " + id);
					return "failure";
				}
			} catch (Exception e) {
				System.err.println("Error in deleteUser: " + e.getMessage());
				e.printStackTrace();
				return "error";
			}	
			} else {
				try {
					int result = userService.removeUser(id);
					System.out.println("membership  없어서 미삭제");
					if (result > 0 ) {
						System.out.println("User deleted: " + id);
						return "success";
					} else {
						System.out.println("User not found: " + id);
						return "failure";
					}
				} catch (Exception e) {
					System.err.println("Error in deleteUser: " + e.getMessage());
					e.printStackTrace();
					return "error";
				}
				
			}
		
	}
}
