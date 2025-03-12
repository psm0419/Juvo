package com.app.dto.chargingstation;

import java.util.List;

import lombok.Data;

@Data
public class ChargingStationRequest {
	private List<String> regions;

    public List<String> getRegions() {
        return regions;
    }    
}
