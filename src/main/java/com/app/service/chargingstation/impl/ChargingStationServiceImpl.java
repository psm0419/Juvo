package com.app.service.chargingstation.impl;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.app.dao.chargingstation.ChargingStationDAO;
import com.app.dto.chargingstation.ChargingStationDTO;
import com.app.service.chargingstation.ChargingStationService;

@Service
public class ChargingStationServiceImpl implements ChargingStationService {

    @Autowired
    private ChargingStationDAO chargingStationDAO;

    @Override
    public void importExcelToDB(String csvFilePath) throws Exception {
        System.out.println("CSV 파일 읽기 시작: " + csvFilePath);
        List<ChargingStationDTO> stations = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(new FileInputStream(csvFilePath), "UTF-8"))) {
            String line;
            boolean isHeader = true; // 첫 줄(헤더) 건너뛰기
            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue; // 헤더 스킵
                }
                String[] data = line.split(",", -1); // 쉼표로 분리, 빈 값도 포함
                if (data.length != 14) {
                    System.out.println("잘못된 데이터 행: " + line);
                    continue;
                }

                ChargingStationDTO dto = new ChargingStationDTO();
                dto.setInstallYear(Integer.parseInt(data[0].trim())); // 설치년도
                dto.setSido(data[1].trim()); // 시도
                dto.setGungu(data[2].trim()); // 군구
                dto.setAddress(data[3].trim()); // 주소
                dto.setStationName(data[4].trim()); // 충전소명
                dto.setFacilityTypeLarge(data[5].trim()); // 시설구분(대)
                dto.setFacilityTypeSmall(data[6].trim()); // 시설구분(소)
                dto.setModelLarge(data[7].trim()); // 기종(대)
                dto.setModelSmall(data[8].trim()); // 기종(소)
                dto.setOperatorLarge(data[9].trim()); // 운영기관(대)
                dto.setOperatorSmall(data[10].trim()); // 운영기관(소)
                dto.setRapidChargeAmount(data[11].trim()); // 급속충전량
                dto.setChargerType(data[12].trim()); // 충전기타입
                dto.setUserRestriction(data[13].trim()); // 이용자제한

                stations.add(dto);
            }
        } catch (Exception e) {
            System.out.println("CSV 읽기 에러: " + e.getMessage());
            throw e;
        }

        System.out.println("데이터 파싱 완료, 저장할 행 수: " + stations.size());
        for (ChargingStationDTO dto : stations) {
            chargingStationDAO.insertChargingStation(dto);
        }
        System.out.println("DB 저장 완료");
    }
}