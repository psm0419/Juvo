package com.app.controller.user;

import com.app.dto.juyuso.Juyuso;
import com.app.service.juyuso.JuyusoService;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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

//	@DeleteMapping("/favorites/delete/")
//	public ResponseEntity<Void> removeFavorite(@PathVariable int juyusoId,
//			@RequestHeader("Authorization") String token) {
//		String userId = jwtUtil.extractUsername(token.substring(7));
//		juyusoService.removeFavorite(userId, juyusoId);
//		return ResponseEntity.ok().build();
//	}
}
