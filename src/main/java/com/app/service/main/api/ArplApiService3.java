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

import com.app.dto.main.AvgByDay;
import com.app.dto.main.AvgByRegion;

public class ArplApiService3 {
    public static String juyuso(String area, String prodcd) throws IOException {
        System.out.println("주유소 API 요청 시작 prodcd : " + prodcd);
        
        // 공공 API URL 구성
        StringBuilder urlBuilder = new StringBuilder("http://www.opinet.co.kr/api/areaAvgRecentPrice.do");
        urlBuilder.append("?" + URLEncoder.encode("code","UTF-8") + "=F250306159");
        urlBuilder.append("&" + URLEncoder.encode("out","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("area","UTF-8") + "=" + URLEncoder.encode(area, "UTF-8")); // 지역코드
        urlBuilder.append("&" + URLEncoder.encode("date","UTF-8") + "=" + URLEncoder.encode("", "UTF-8")); // 시도코드
        urlBuilder.append("&" + URLEncoder.encode("prodcd","UTF-8") + "=" + URLEncoder.encode(prodcd, "UTF-8")); // 제품구분
        
        
        System.out.println("요청 URL: " + urlBuilder.toString());
        
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
        System.out.println("API 응답 데이터: " + (response.length() > 100 ? response.substring(0, 100) + "..." : response));
        
        return response;
    } 
    
    public static List<AvgByDay> avgByDay(String area, String prodcd) throws Exception {
    	
    	List<AvgByDay> avgList = new ArrayList<AvgByDay>();
    	
    	try {
            String jsonText = juyuso(area,prodcd); 
            System.out.println("파싱할 JSON 데이터: " + jsonText);
            
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

	            AvgByDay abd = new AvgByDay();
	            abd.setDate((String) oil.get("DATE"));
	            abd.setProdcd((String) oil.get("AREA_CD"));
	            abd.setProdcd((String) oil.get("AREA_NM"));
	            abd.setProdcd((String) oil.get("PRODCD"));

	            // PRICE는 Long으로 되어 있을 수 있으므로 Double로 변환
	            abd.setPrice(((Number) oil.get("PRICE")).doubleValue());

	            avgList.add(abd);
	        }
           

        } catch (IOException e) {
            e.printStackTrace();
        }

        return avgList;
    }
    
}