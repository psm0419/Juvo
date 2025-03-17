-- users 테이블
CREATE TABLE users (
    id VARCHAR2(64) PRIMARY KEY,
    username VARCHAR2(32) ,
    nickname VARCHAR2(48)  UNIQUE,
    pw VARCHAR2(256) ,
    email VARCHAR2(64)  ,
    tel VARCHAR2(24)  ,
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
    USER_ID VARCHAR2(64) NOT NULL,
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
    user_id VARCHAR2(64) NOT NULL,
    keyword NUMBER
);

-- 키워드 테이블
CREATE TABLE keyword (
    keyword_id NUMBER PRIMARY KEY,
    keyword VARCHAR2(32)
);

-- 사용자가 좋아하는 주유소
CREATE TABLE like_juyuso (
    user_id VARCHAR2(64) NOT NULL,
    UNI_ID VARCHAR2(32) NOT NULL
);

-- 블랙리스트 주유소
CREATE TABLE black_juyuso (
    UNI_ID VARCHAR2(32) NOT NULL,
    black_type NUMBER NOT NULL,
    LPG_YN VARCHAR2(2),
    OS_NM VARCHAR2(255),
    NEW_ADR VARCHAR2(255),
    status NUMBER -- 0 미처리 1 처리
);

-- 블랙리스트 유형
-- 1 용도외판매 2 품질기준부적합 3 가짜석유취급 4 정량미달판매
CREATE TABLE black_type (
    black_id NUMBER PRIMARY KEY,  
    black_type VARCHAR2(100) 
);

--------------공지사항 DB 테이블 및 시퀀스------------

CREATE TABLE NOTICE (
  NOTICE_ID    NUMBER(10) PRIMARY KEY,   -- 공지사항 번호
  TITLE        VARCHAR2(200) NOT NULL,    -- 제목
  CONTENT      CLOB NOT NULL,             -- 상세 내용
  CREATED_DATE DATE DEFAULT SYSDATE         -- 작성일 (기본값: 현재 날짜)
);

CREATE SEQUENCE NOTICE_SEQ
START WITH 1
INCREMENT BY 1
NOCACHE;
------------------멤버쉽----------------------

create table membership (
    id varchar2(32) primary key,
    user_id varchar2(64) ,
    name  varchar2(32),
    tel varchar2(32),
    address varchar2(32),
    detail_address varchar2(32),
    card_company varchar2(32),
    card_number varchar2(32),
    cvc varchar2(32),
    expiry varchar2(32),
    created_at timestamp
);

create SEQUENCE membership_seq
START WITH 1
INCREMENT BY 1
NOCYCLE;


------drop 테이블----------------

--
--drop table users;
--drop table juyuso;
--drop table juyuso_review;
--drop table lowest_cost;
--drop table charging_station;
--drop table user_keyword;
--drop table like_juyuso;
--drop table black_type;
--drop table card;
--drop table notice;
--drop table membership;

--------------drop sequence------------
--drop sequence juyuso_review_seq;
--drop sequence NOTICE_SEQ;
--drop sequence membership_seq;


-------------user_id varchar2 (64로 바꾸는 코드)---------------------
--ALTER TABLE membership MODIFY (user_id VARCHAR2(64));

-------------------관리자 주는 코드----------------
--Update users set user_type = 'ADM' where nickname = '';

---------------일반유저로 바뀌는 코드------------------
--Update users set user_type = 'CUS' where nickname = '';


