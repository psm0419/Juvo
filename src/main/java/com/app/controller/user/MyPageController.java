package com.app.controller.user;

import com.app.dto.juyuso.Juyuso;
import com.app.service.juyuso.JuyusoService;
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

@RestController
public class MyPageController {

	@Autowired
	JuyusoService juyusoService;

	@Autowired
	UserService userService;

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
}
