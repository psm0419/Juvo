package com.app.service.main.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.app.dto.main.CheapJuyuso;

public class ArplApiService {
    public static String juyuso(String area, String prodcd) throws IOException {
        System.out.println("주유소 API 요청 시작: area=" + area + "prodcd=" + prodcd);
        
        // 공공 API URL 구성
        StringBuilder urlBuilder = new StringBuilder("http://www.opinet.co.kr/api/lowTop10.do");
        urlBuilder.append("?" + URLEncoder.encode("out","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("code","UTF-8") + "=F250220122");
        urlBuilder.append("&" + URLEncoder.encode("prodcd","UTF-8") + "=" + URLEncoder.encode(prodcd, "UTF-8")); // 제품구분
        urlBuilder.append("&" + URLEncoder.encode("area","UTF-8") + "=" + URLEncoder.encode(area, "UTF-8")); // 지역구분
        urlBuilder.append("&" + URLEncoder.encode("cnt","UTF-8") + "=" + URLEncoder.encode("5", "UTF-8")); //최저가순 결과 건수
        
        
        
        
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setConnectTimeout(10000); // 10초 연결 타임아웃
        conn.setReadTimeout(10000);    // 10초 읽기 타임아웃
        System.out.println("API 응답 코드: " + conn.getResponseCode());
        
        BufferedReader rd;
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            System.out.println("API 오류 응답: " + conn.getResponseCode());
        }
        
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();
        
        String response = sb.toString();
        
        
        return response;
    } 
    
    public static List<CheapJuyuso> cheapJuyusoList(String prodcd, String area) throws Exception {
    	
    	List<CheapJuyuso> cheapJuyusoList = new ArrayList<CheapJuyuso>();
    	
    	try {
            String jsonText = juyuso(prodcd, area); 
            
            
            JSONParser jsonParser = new JSONParser();
			JSONObject jsonObj = (JSONObject)jsonParser.parse(jsonText); 
			
			JSONObject result = (JSONObject) jsonObj.get("RESULT");
			
			if (result == null) {
			    throw new ParseException(ParseException.ERROR_UNEXPECTED_EXCEPTION);
			}
			
		    JSONArray oilArray = (JSONArray) result.get("OIL");
		    
		    if (oilArray == null) {
		        throw new ParseException(ParseException.ERROR_UNEXPECTED_EXCEPTION);
		    }
			
			for (Object obj : oilArray) {
	            JSONObject oil = (JSONObject) obj;

	            CheapJuyuso cj = new CheapJuyuso();
	            cj.setUniId((String) oil.get("UNI_ID"));

	            // PRICE는 Long으로 되어 있을 수 있으므로 Double로 변환
	            cj.setPrice(((Number) oil.get("PRICE")).doubleValue());

	            cj.setPollDivCd((String) oil.get("POLL_DIV_CD"));
	            cj.setOsNm((String) oil.get("OS_NM"));
	            cj.setVanAdr((String) oil.get("VAN_ADR"));
	            cj.setNewAdr((String) oil.get("NEW_ADR"));

	            // GIS_X_COOR, GIS_Y_COOR는 Long 타입이므로 Double로 변환
	            cj.setGisXCoor(((Number) oil.get("GIS_X_COOR")).doubleValue());
	            cj.setGisYCoor(((Number) oil.get("GIS_Y_COOR")).doubleValue());

	            cheapJuyusoList.add(cj);
	        }
            

        } catch (IOException e) {
            e.printStackTrace();
        }

        return cheapJuyusoList;
    }
    
}