-- users 테이블




-- 주유소 정보 테이블



-- 주유소 리뷰 테이블



-- 최저가 주유소 테이블



-- 전기차 충전소 테이블



-- 사용자 관심 키워드 테이블



-- 키워드 테이블


-- 사용자가 좋아하는 주유소


-- 블랙리스트 주유소
INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JUY001', 1, 'N', '장화주유소', '전북 김제시 벽골제로 637 (장화동)', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JUY002', 3, 'N', '칠송정주유소', '경북 칠곡군 가산면 인동가산로 827', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JBP001', 1, 'N', 'SK동방에너지', '부산광역시 북구 백양대로1016번나길 76-11', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JBP002', 1, 'N', '연수에너지', '인천광역시 중구 제물량로241번길 24', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status, 1) 
VALUES ('JBP003', 1, 'N', '대구에너지', '대구광역시 서구 당산로67길 8', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JBP004', 3, 'N', '작전석유', '경기도 부천시 소사구 경인로216번길 61 (심곡본동)', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JUY003', 3, 'N', '㈜케이씨 양주주유소', '경기 양주시 은현면 화합로 1174', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JUY004', 3, 'N', '수동주유소', '경기 남양주시 수동면 비룡로 815', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JBP005', 1, 'N', '태성에너지', '경상북도 문경시 영순면 사근왕태길 24-1', 1);

INSERT INTO black_juyuso (UNI_ID, black_type, LPG_YN, OS_NM, NEW_ADR, status) 
VALUES ('JBP006', 3, 'N', '대성석유', '인천광역시 미추홀구 미추홀대로697번길16 (주안동)', 1);

-- 블랙리스트 유형
INSERT INTO black_type (black_id, black_type) VALUES (1, '용도외판매');
INSERT INTO black_type (black_id, black_type) VALUES (2, '품질기준부적합');
INSERT INTO black_type (black_id, black_type) VALUES (3, '가짜석유취급');
INSERT INTO black_type (black_id, black_type) VALUES (4, '정량미달판매');

-- 주유소 신고 테이블


-- 사용자 카드 정보


-- 공지사항
INSERT INTO NOTICE (NOTICE_ID, TITLE, CONTENT, CREATED_DATE)
VALUES (NOTICE_SEQ.NEXTVAL, '사이트 폐업 예고', '본 사이트는 프로젝트를 위한 사이트 이므로 3월19일에 폐쇄될 예정입니다. ', SYSDATE);

INSERT INTO NOTICE (NOTICE_ID, TITLE, CONTENT, CREATED_DATE)
VALUES (NOTICE_SEQ.NEXTVAL, '사이트 매매 합니다.', '본 사이트 JUVO는 매매 중 입니다.', SYSDATE);


