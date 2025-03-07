package com.app.dto.juyuso;

import lombok.Data;

@Data
public class Juyuso {
	 String uniId;
     String pollDivCd;
     String osNm;
     String vanAdr;
     String newAdr;
     String tel;
     String siguncd;
     String lpgYn;
     String maintYn;
     String carWashYn;
     String kpetroYn;
     String cvsYn;
     Double gisXCoor;
     Double gisYCoor;
     Double hOilPrice; // B027: 휘발유
     Double gOilPrice; // B034: 고급휘발유
     Double dOilPrice; // D047: 경유
     Double iOilPrice; // C004: 실내등유
     Integer operatation;     
}
