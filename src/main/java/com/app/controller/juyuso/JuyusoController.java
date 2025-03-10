package com.app.controller.juyuso;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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
            // DB에 데이터 저장
            boolean saved = juyusoService.fetchAndSaveJuyusoData(lat, lng);
            if (!saved) {
                System.out.println("Failed to save juyuso data");
                return Map.of("error", "Failed to save juyuso data");
            }

            // DB에서 데이터 조회
            String dbResponse = juyusoService.getJuyusoWithDetails(lat, lng);
            JsonNode root = objectMapper.readTree(dbResponse);
            JsonNode stations = root.path("value"); // ResponseWrapper의 value 필드

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
    
    @PostMapping("/api/favorite/juyuso")
    @ResponseBody
    public ResponseEntity<Map<String, String>> registerFavoriteStation(
            HttpServletRequest request,
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
}