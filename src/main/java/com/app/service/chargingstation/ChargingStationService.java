package com.app.service.chargingstation;

public interface ChargingStationService {
    void importExcelToDB(String csvFilePath) throws Exception;
}