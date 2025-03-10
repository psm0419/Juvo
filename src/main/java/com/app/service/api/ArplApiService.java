package com.app.service.api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

public class ArplApiService {
    
    public static String juyuso(String lat, String lng) throws IOException {
        System.out.println("주유소 API 요청 시작: lat=" + lat + ", lng=" + lng);
        StringBuilder urlBuilder = new StringBuilder("https://www.opinet.co.kr/api/aroundAll.do");
        urlBuilder.append("?" + URLEncoder.encode("code", "UTF-8") + "=F250220122");
        urlBuilder.append("&" + URLEncoder.encode("x", "UTF-8") + "=" + URLEncoder.encode(lng, "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("y", "UTF-8") + "=" + URLEncoder.encode(lat, "UTF-8"));
        urlBuilder.append("&" + URLEncoder.encode("radius", "UTF-8") + "=5000");
        urlBuilder.append("&" + URLEncoder.encode("sort", "UTF-8") + "=1");
        urlBuilder.append("&" + URLEncoder.encode("prodcd", "UTF-8") + "=B027");
        urlBuilder.append("&" + URLEncoder.encode("out", "UTF-8") + "=json");
        System.out.println("요청 URL: " + urlBuilder.toString());
        
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        System.out.println("API 응답 코드: " + conn.getResponseCode());
        
        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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
        System.out.println("API 응답 데이터 (전체): " + response); // 전체 응답 출력
        return response;
    }  

    public static String juyusoDetail(String id) throws IOException {        
        StringBuilder urlBuilder = new StringBuilder("https://www.opinet.co.kr/api/detailById.do");
        urlBuilder.append("?" + URLEncoder.encode("code", "UTF-8") + "=F250306157");
        urlBuilder.append("&" + URLEncoder.encode("id", "UTF-8") + "=" + URLEncoder.encode(id, "UTF-8"));        
        urlBuilder.append("&" + URLEncoder.encode("out", "UTF-8") + "=json");
        System.out.println("요청 URL: " + urlBuilder.toString());
        
        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        System.out.println("API 응답 코드: " + conn.getResponseCode());
        
        BufferedReader rd;
        if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
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
        System.out.println("API 응답 데이터 (전체): " + response); // 전체 응답 출력
        return response;
    }        
}