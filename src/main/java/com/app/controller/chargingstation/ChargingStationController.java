package com.app.controller.chargingstation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.app.dto.chargingstation.ChargingStation;
import com.app.service.chargingstation.ChargingStationService;

@Controller
public class ChargingStationController {
    @Autowired
    private ChargingStationService chargingStationService;

    @PostMapping("/importExcel")
    @ResponseBody
    public String importExcel() throws Exception {
        String csvFilePath = "C:/charging_station_data/charging_station.csv"; // 경로 확인
        chargingStationService.importExcelToDB(csvFilePath);
        return "데이터 저장 완료";
    }
    
 	//지역 목록 반환
    @GetMapping("/chargingStationList")
    @ResponseBody
    public List<String> getSidoList() {
        return chargingStationService.getAllSido();
    }
    
    // 데이터 조회
    @PostMapping("/getChargingStation")
    @ResponseBody
    public List<ChargingStation> searchChargingStations(@RequestParam("sido") List<String> selectedSido) {
        return chargingStationService.getChargingStationsBySido(selectedSido);
    }
}