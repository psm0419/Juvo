package com.app.dto.juyuso;

import lombok.Data;

@Data
public class Juyuso {
	private String uniId;
    private String pollDivCd;
    private String osNm;
    private String vanAdr;
    private String newAdr;
    private String tel;
    private String siguncd;
    private String lpgYn;
    private String maintYn;
    private String carWashYn;
    private String kpetroYn;
    private String cvsYn;
    private Double gisXCoor;
    private Double gisYCoor;
    private Double hOilPrice;
    private Double gOilPrice;
    private Integer operatation;
}
