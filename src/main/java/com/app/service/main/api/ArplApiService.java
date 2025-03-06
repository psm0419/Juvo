package com.app.service.main.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

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
}