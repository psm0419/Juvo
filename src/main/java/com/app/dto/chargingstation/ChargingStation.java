package com.app.dto.chargingstation;
import lombok.Data;
@Data
public class ChargingStation {
    private int installYear;
    private String sido;
    private String gungu;
    private String address;
    private String stationName;
    private String facilityTypeLarge;
    private String facilityTypeSmall;
    private String modelLarge;
    private String modelSmall;
    private String operatorLarge;
    private String operatorSmall;
    private String rapidChargeAmount;
    private String chargerType;
    private String userRestriction;
}