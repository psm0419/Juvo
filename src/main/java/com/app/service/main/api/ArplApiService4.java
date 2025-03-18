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
import com.app.dto.main.AvgByDayAll;
import com.app.dto.main.AvgByRegion;

public class ArplApiService4 {
    public static String juyuso(String prodcd) throws IOException {
        System.out.println("주유소 API 요청 시작 prodcd : " + prodcd);
        
        // 공공 API URL 구성
        StringBuilder urlBuilder = new StringBuilder("http://www.opinet.co.kr/api/avgRecentPrice.do");
        urlBuilder.append("?" + URLEncoder.encode("out","UTF-8") + "=" + URLEncoder.encode("json", "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("code","UTF-8") + "=F250306157");
        urlBuilder.append("&" + URLEncoder.encode("date","UTF-8") + "=" + URLEncoder.encode("", "UTF-8")); // 일자
        urlBuilder.append("&" + URLEncoder.encode("prodcd","UTF-8") + "=" + URLEncoder.encode(prodcd, "UTF-8")); // 제품구분
        
        
        
        
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
    
    public static List<AvgByDayAll> avgByDayAll(String prodcd) throws Exception {
    	
    	List<AvgByDayAll> avgList = new ArrayList<AvgByDayAll>();
    	
    	try {
            String jsonText = juyuso(prodcd); 
            
            
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

	            AvgByDayAll abda = new AvgByDayAll();
	            abda.setDate((String) oil.get("DATE"));
	            abda.setProdcd((String) oil.get("PRODCD"));

	            // PRICE는 Long으로 되어 있을 수 있으므로 Double로 변환
	            abda.setPrice(((Number) oil.get("PRICE")).doubleValue());

	            avgList.add(abda);
	        }
           

        } catch (IOException e) {
            e.printStackTrace();
        }

        return avgList;
    }
    
}