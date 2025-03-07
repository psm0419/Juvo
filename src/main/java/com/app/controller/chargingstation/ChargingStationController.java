package com.app.controller.chargingstation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import com.app.service.chargingstation.ChargingStationService;

@RestController
public class ChargingStationController {
    @Autowired
    private ChargingStationService chargingStationService;

    @PostMapping("/importExcel")
    public String importExcel() throws Exception {
        String csvFilePath = "C:/charging_station_data/charging_station.csv"; // 경로 확인
        chargingStationService.importExcelToDB(csvFilePath);
        return "데이터 저장 완료";
    }
}