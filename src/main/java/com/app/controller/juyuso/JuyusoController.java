package com.app.controller.juyuso;
import java.io.IOException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.app.service.api.ArplApiService;

@Controller
public class JuyusoController {
    // 주유소 맵 화면을 반환하는 부분
    @GetMapping("/juyuso")
    public String juyuso() {
        return "juyuso/JuyusoMap"; // 주유소 맵을 렌더링할 HTML 페이지
    }

    // 주유소 정보를 요청하는 API
    @GetMapping("/getJuyuso")
    @ResponseBody
    public String getJuyuso(@RequestParam double lat, @RequestParam double lng) {
        try {
            System.out.println("WGS84 좌표 수신: lat=" + lat + ", lng=" + lng);

            // WGS84 -> KATEC 좌표 변환 (GeoTrans 클래스 사용)
            GeoTrans trans = new GeoTrans(1, lng, lat);
            double katecX = trans.outpt_y;
            double katecY = trans.outpt_x;

            System.out.println("KATEC 좌표 변환 결과: x=" + katecX + ", y=" + katecY);

            // 변환된 KATEC 좌표로 API 요청
            String result = ArplApiService.juyuso(String.valueOf(katecX), String.valueOf(katecY));
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }
}