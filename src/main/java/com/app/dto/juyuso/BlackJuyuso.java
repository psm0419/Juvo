package com.app.dto.juyuso;

import lombok.Data;

@Data
public class BlackJuyuso {
	 String uniId; //주유소코드
     String pollDivCd;
     String osNm; //상호
     String vanAdr;
     String newAdr; //주소
     String tel;
     String siguncd;
     String lpgYn; //주유소유형
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
     int blackType; //블랙타입
}
