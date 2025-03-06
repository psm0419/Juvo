package com.app.controller.juyuso;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.app.service.api.ArplApiService;
import com.app.service.juyuso.JuyusoService;

@Controller
public class JuyusoController {
    
    @Autowired
    JuyusoService juyusoService;
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
}