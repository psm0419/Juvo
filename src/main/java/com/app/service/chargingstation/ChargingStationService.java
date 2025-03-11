package com.app.service.chargingstation;

import java.util.List;

import com.app.dto.chargingstation.ChargingStation;

public interface ChargingStationService {
    void importExcelToDB(String csvFilePath) throws Exception;
    
    List<ChargingStation> getChargingStationsBySido(List<String> sidoList);
    List<String> getAllSido();
}