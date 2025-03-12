package com.app.controller.juyuso;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.app.dto.user.User;
import com.app.service.juyuso.JuyusoService;
import com.app.service.user.UserService;
import com.app.util.JwtProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class JuyusoController {

	@Autowired
	JuyusoService juyusoService;
	@Autowired
	UserService userService;

	final ObjectMapper objectMapper = new ObjectMapper();

	@GetMapping("/juyuso")
	public String juyuso() {
		return "juyuso/JuyusoMap";
	}

	@GetMapping("/getJuyuso")
	@ResponseBody
	public Map<String, Object> getJuyuso(@RequestParam double lat, @RequestParam double lng) {
		try {
			boolean saved = juyusoService.fetchAndSaveJuyusoData(lat, lng);
			if (!saved) {
				System.out.println("Failed to save juyuso data");
				return Map.of("error", "Failed to save juyuso data");
			}

			String dbResponse = juyusoService.getJuyusoWithDetails(lat, lng);
			JsonNode root = objectMapper.readTree(dbResponse);
			JsonNode stations = root.path("value");

			Map<String, Object> response = new HashMap<>();
			response.put("RESULT", Map.of("OIL", objectMapper.convertValue(stations, List.class)));
			System.out.println("Returning juyuso data from DB: " + objectMapper.writeValueAsString(response));
			return response;
		} catch (Exception e) {
			e.printStackTrace();
			return Map.of("error", e.getMessage());
		}
	}

	@GetMapping("/fetch")
	public ResponseEntity<String> fetchAndSaveJuyuso(@RequestParam double lat, @RequestParam double lng) {
		boolean success = juyusoService.fetchAndSaveJuyusoData(lat, lng);
		return success ? ResponseEntity.ok("데이터 저장 완료!") : ResponseEntity.status(500).body("저장 실패");
	}

	@GetMapping("/saveJuyuso")
	@ResponseBody
	public String saveJuyuso(@RequestParam double lat, @RequestParam double lng) {
		boolean result = juyusoService.fetchAndSaveJuyusoData(lat, lng);
		return result ? "{\"status\":\"success\"}" : "{\"status\":\"error\"}";
	}

	@GetMapping("/getJuyusoWithDetails")
	@ResponseBody
	public String getJuyusoWithDetails(@RequestParam double lat, @RequestParam double lng) {
		return juyusoService.getJuyusoWithDetails(lat, lng);
	}

	// 관심 주유소 등록
	@PostMapping("/api/favorite/juyuso")
	@ResponseBody
	public ResponseEntity<Map<String, String>> registerFavoriteStation(HttpServletRequest request,
			@RequestBody Map<String, String> requestBody) {
		String token = JwtProvider.extractToken(request);
		if (token == null || !JwtProvider.isVaildToken(token)) {
			return ResponseEntity.status(401).body(Map.of("status", "error", "message", "유효하지 않은 토큰입니다."));
		}

		String userId = JwtProvider.getUserIdFromToken(token);
		System.out.println("Extracted userId: " + userId);
		if (userId == null || userId.trim().isEmpty()) {
			return ResponseEntity.status(401).body(Map.of("status", "error", "message", "사용자 ID를 가져올 수 없습니다."));
		}

		User user = userService.findUserById(userId);
		if (user == null) {
			return ResponseEntity.status(400).body(Map.of("status", "error", "message", "유효하지 않은 사용자입니다."));
		}

		String uniId = requestBody.get("uniId");
		boolean success = juyusoService.registerFavoriteStation(userId, uniId);
		if (success) {
			return ResponseEntity.ok(Map.of("status", "success", "message", "관심 주유소로 등록되었습니다."));
		} else {
			return ResponseEntity.status(400).body(Map.of("status", "error", "message", "이미 등록된 주유소입니다."));
		}
	}

	// 리뷰 저장
	@PostMapping("/api/reviews")
	@ResponseBody
	public ResponseEntity<Map<String, String>> saveReview(HttpServletRequest request,
			@RequestBody Map<String, String> requestBody) {
		String token = JwtProvider.extractToken(request);
		if (token == null || !JwtProvider.isVaildToken(token)) {
			return ResponseEntity.status(401).body(Map.of("status", "error", "message", "유효하지 않은 토큰입니다."));
		}

		String userId = JwtProvider.getUserIdFromToken(token);
		if (userId == null || userId.trim().isEmpty()) {
			return ResponseEntity.status(401).body(Map.of("status", "error", "message", "사용자 ID를 가져올 수 없습니다."));
		}

		String uniId = requestBody.get("uniId");
		String content = requestBody.get("content");
		double starCnt;
		try {
			starCnt = Double.parseDouble(requestBody.get("starCnt"));
			if (starCnt < 0 || starCnt > 5)
				throw new NumberFormatException();
		} catch (NumberFormatException e) {
			return ResponseEntity.status(400).body(Map.of("status", "error", "message", "별점은 0~5 사이여야 합니다."));
		}

		boolean success = juyusoService.saveReview(userId, uniId, content, starCnt);
		return success ? ResponseEntity.ok(Map.of("status", "success", "message", "리뷰가 저장되었습니다."))
				: ResponseEntity.status(400).body(Map.of("status", "error", "message", "리뷰 저장에 실패했습니다."));
	}
	//키워드 저장
	@PostMapping("/api/keywords")
    @ResponseBody
    public ResponseEntity<Map<String, String>> saveKeywords(
            HttpServletRequest request,
            @RequestBody Map<String, Object> requestBody) {
        String token = JwtProvider.extractToken(request);
        if (token == null || !JwtProvider.isVaildToken(token)) {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "유효하지 않은 토큰입니다."));
        }

        String userId = JwtProvider.getUserIdFromToken(token);
        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "사용자 ID를 가져올 수 없습니다."));
        }

        String uniId = (String) requestBody.get("uniId");
        @SuppressWarnings("unchecked")
        List<Integer> keywords = (List<Integer>) requestBody.get("keywords");
        if (keywords == null || keywords.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("status", "error", "message", "키워드가 제공되지 않았습니다."));
        }

        boolean success = juyusoService.saveKeywords(userId, uniId, keywords);
        return success ? ResponseEntity.ok(Map.of("status", "success", "message", "키워드가 저장되었습니다."))
                       : ResponseEntity.status(400).body(Map.of("status", "error", "message", "키워드 저장에 실패했습니다."));
    }
    
	// 키워드 조회
    @GetMapping("/api/keywords")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getKeywords(HttpServletRequest request, @RequestParam String uniId) {
        Map<String, Object> response = new HashMap<>();
        Map<Integer, Integer> keywordCounts = juyusoService.getAllKeywordsCountByStation(uniId);
        response.put("keywordCounts", keywordCounts);
        return ResponseEntity.ok(response);
    }

	// 리뷰 삭제 (추가)
	@DeleteMapping("/api/reviews")
	@ResponseBody
	public ResponseEntity<Map<String, String>> deleteReview(HttpServletRequest request,
			@RequestBody Map<String, String> requestBody) {
		String token = JwtProvider.extractToken(request);
		if (token == null || !JwtProvider.isVaildToken(token)) {
			return ResponseEntity.status(401).body(Map.of("status", "error", "message", "유효하지 않은 토큰입니다."));
		}

		String userId = JwtProvider.getUserIdFromToken(token);
		String uniId = requestBody.get("uniId");
		String content = requestBody.get("content"); // 삭제할 리뷰 식별용

		boolean success = juyusoService.deleteReview(userId, uniId, content);
		return success ? ResponseEntity.ok(Map.of("status", "success", "message", "리뷰가 삭제되었습니다."))
				: ResponseEntity.status(400).body(Map.of("status", "error", "message", "리뷰 삭제에 실패했습니다."));
	}

	@GetMapping("/api/user-keywords")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> getUserKeywords(HttpServletRequest request, @RequestParam String uniId) {
	    Map<String, Object> response = new HashMap<>();
	    String token = JwtProvider.extractToken(request);

	    if (token == null || !JwtProvider.isVaildToken(token)) {
	        return ResponseEntity.status(401).body(Map.of("status", "error", "message", "유효하지 않은 토큰입니다."));
	    }

	    String userId = JwtProvider.getUserIdFromToken(token);
	    if (userId == null || userId.trim().isEmpty()) {
	        return ResponseEntity.status(401).body(Map.of("status", "error", "message", "사용자 ID를 가져올 수 없습니다."));
	    }

	    List<Integer> userKeywords = juyusoService.getKeywordsByStationAndUser(uniId, userId);
	    response.put("keywords", userKeywords);
	    return ResponseEntity.ok(response);
	}
	
	// 리뷰 조회
	@GetMapping("/api/reviews")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> getReviews(@RequestParam String uniId) {
		try {
			Map<String, Object> reviewsData = juyusoService.getReviewsByStationId(uniId);
			return ResponseEntity.ok(reviewsData);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body(Map.of("status", "error", "message", e.getMessage()));
		}
	}
	
	// 불법 주유소 신고
	@PostMapping("/registerblack")
    @ResponseBody
    public ResponseEntity<Map<String, String>> registerBlack(HttpServletRequest request,
            @RequestBody Map<String, Object> requestBody) {
        String token = JwtProvider.extractToken(request);
        if (token == null || !JwtProvider.isVaildToken(token)) {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "유효하지 않은 토큰입니다."));
        }

        String userId = JwtProvider.getUserIdFromToken(token);
        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "사용자 ID를 가져올 수 없습니다."));
        }

        User user = userService.findUserById(userId);
        if (user == null) {
            return ResponseEntity.status(400).body(Map.of("status", "error", "message", "유효하지 않은 사용자입니다."));
        }

        String uniId = (String) requestBody.get("uniId");
        int blackType;
        try {
            blackType = Integer.parseInt(requestBody.get("blackType").toString());
            if (blackType < 1 || blackType > 4) throw new NumberFormatException();
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("status", "error", "message", "유효하지 않은 신고 유형입니다."));
        }

        boolean success = juyusoService.registerBlackStation(userId, uniId, blackType);
        if (success) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "불법 주유소로 신고되었습니다."));
        } else {
            return ResponseEntity.status(400).body(Map.of("status", "error", "message", "이미 신고된 주유소입니다."));
        }
    }
}