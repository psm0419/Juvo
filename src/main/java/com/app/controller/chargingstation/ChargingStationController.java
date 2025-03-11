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
    
 // 페이지 이동
    @GetMapping("/list")
    public String showListPage(Model model) {
        // 지역 목록을 위한 데이터 (실제로는 DB에서 가져오는 것이 좋음)
        List<String> sidoList = chargingStationService.getAllSido();
        model.addAttribute("sidoList", sidoList);
        return "charging/list"; // list.jsp로 이동
    }
    
    // 데이터 조회
    @PostMapping("/search")
    @ResponseBody
    public List<ChargingStation> searchChargingStations(@RequestParam("sido") List<String> selectedSido) {
        return chargingStationService.getChargingStationsBySido(selectedSido);
    }
}