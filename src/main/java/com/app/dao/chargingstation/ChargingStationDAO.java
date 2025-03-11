package com.app.dao.chargingstation;

import java.util.List;

import com.app.dto.chargingstation.ChargingStation;

public interface ChargingStationDAO {
	void insertChargingStation(ChargingStation dto);
	
	List<ChargingStation> selectBySido(List<String> sidoList);
    List<String> selectAllSido();
}