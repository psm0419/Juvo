-- users 테이블
CREATE TABLE users (
    id VARCHAR2(32) PRIMARY KEY,
    username VARCHAR2(32) ,
    nickname VARCHAR2(48)  UNIQUE,
    pw VARCHAR2(256) ,
    email VARCHAR2(64)  UNIQUE,
    tel VARCHAR2(24)  UNIQUE,
    jumin VARCHAR2(16) ,
    user_type VARCHAR2(16) ,
    membership NUMBER
);

-- 주유소 정보 테이블
CREATE TABLE juyuso (
    UNI_ID VARCHAR2(32) PRIMARY KEY,
    POLL_DIV_CD VARCHAR2(16),
    OS_NM VARCHAR2(255),
    VAN_ADR VARCHAR2(255),
    NEW_ADR VARCHAR2(255),
    TEL VARCHAR2(20),
    SIGUNCD VARCHAR2(12),
    LPG_YN VARCHAR2(2),
    MAINT_YN VARCHAR2(2),
    CAR_WASH_YN VARCHAR2(2),
    KPETRO_YN VARCHAR2(2),
    CVS_YN VARCHAR2(2),
    GIS_X_COOR NUMBER(12,6),
    GIS_Y_COOR NUMBER(12,6),
    H_OIL_PRICE NUMBER(10,2), -- B027: 휘발유 가격
    G_OIL_PRICE NUMBER(10,2), -- B034: 고급휘발유 가격
    D_OIL_PRICE NUMBER(10,2), -- D047: 경유 가격
    I_OIL_PRICE NUMBER(10,2), -- C004: 실내등유 가격
    OPERATATION NUMBER default 1
);

-- 주유소 리뷰 테이블
CREATE TABLE juyuso_review (
    REVIEW_ID NUMBER PRIMARY KEY,
    USER_ID VARCHAR2(32) NOT NULL,
    UNI_ID VARCHAR2(32) NOT NULL,
    starCnt VARCHAR2(36),
    content VARCHAR2(3000),
    create_at DATE
);

CREATE SEQUENCE juyuso_review_seq
START WITH 1  -- 시작 번호
INCREMENT BY 1  -- 증가 단위
NOCACHE  -- 캐싱 비활성화
NOCYCLE;

-- 최저가 주유소 테이블
CREATE TABLE lowest_cost (
    UNI_ID VARCHAR2(32) PRIMARY KEY,
    PRICE NUMBER,
    POLL_DIV_CD VARCHAR2(16),
    OS_NM VARCHAR2(255),
    VAN_ADR VARCHAR2(255),
    NEW_ADR VARCHAR2(255),
    tel VARCHAR2(32),
    GIS_X_COOR NUMBER(10,6),
    GIS_Y_COOR NUMBER(10,6)
);

-- 전기차 충전소 테이블
CREATE TABLE CHARGING_STATION (
    install_year INT,
    sido VARCHAR(50),
    gungu VARCHAR(50),
    address VARCHAR(255),
    station_name VARCHAR(100),
    facility_type_large VARCHAR(50),
    facility_type_small VARCHAR(50),
    model_large VARCHAR(50),
    model_small VARCHAR(50),
    operator_large VARCHAR(50),
    operator_small VARCHAR(50),
    rapid_charge_amount VARCHAR(50),
    charger_type VARCHAR(50),
    user_restriction VARCHAR(50)
);

-- 사용자 관심 키워드 테이블
--1:친절 2:진출입 편함 3: 깔끔한 시설 4: 정량 주유 5:믿음가는 품질 6:사은품 증정 7: 주유시 세차 할인
CREATE TABLE user_keyword (
    UNI_ID VARCHAR2(32) NOT NULL,
    user_id VARCHAR2(32) NOT NULL,
    keyword NUMBER
);

-- 키워드 테이블
CREATE TABLE keyword (
    keyword_id NUMBER PRIMARY KEY,
    keyword VARCHAR2(32)
);

-- 사용자가 좋아하는 주유소
CREATE TABLE like_juyuso (
    user_id VARCHAR2(32) NOT NULL,
    UNI_ID VARCHAR2(32) NOT NULL
);

-- 블랙리스트 주유소
CREATE TABLE black_juyuso (
    UNI_ID VARCHAR2(32) NOT NULL,
    black_type NUMBER NOT NULL
);

-- 블랙리스트 유형
CREATE TABLE black_type (
    black_id NUMBER PRIMARY KEY,
    black_type VARCHAR2(100)
);

-- 주유소 신고 테이블
CREATE TABLE report_juyuso (
    REPORT_ID NUMBER PRIMARY KEY,
    USER_ID VARCHAR2(32) NOT NULL,
    UNI_ID VARCHAR2(32) NOT NULL,
    content VARCHAR2(3000),
    create_at DATE
);

-- 사용자 카드 정보
CREATE TABLE card (
    USER_ID VARCHAR2(32) NOT NULL,
    card_info VARCHAR2(512)
);