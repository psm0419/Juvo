package com.app.service.main.api;

import java.util.List;


public class ApiExplorer {
    public static void main(String[] args) {
        String area = "0101"; 
        String prodcd = "B027";

    	String juyusoList = null;

        try {
        	juyusoList = ArplApiService.juyuso(area, prodcd);

            if (juyusoList == null || juyusoList.isEmpty()) {
                System.out.println("저장할 데이터가 없습니다.");
                return;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return; // 예외 발생 시 종료
        }

        // ArplInfo 객체 -> DB에 저장
//        ArplDAO arplDAO = new ArplDAO();
//        int count = 0;
//
//        for (Attraction ai : attractionInfoList) {
//            count += arplDAO.saveArplInfo(ai);
//        }
//
//        System.out.println(count + "개 저장 성공!");
    }
}
