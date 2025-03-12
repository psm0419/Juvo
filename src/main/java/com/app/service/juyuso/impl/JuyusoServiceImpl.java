package com.app.service.juyuso.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.controller.juyuso.GeoTrans;
import com.app.dao.juyuso.JuyusoDAO;
import com.app.dto.juyuso.BlackJuyuso;
import com.app.dto.juyuso.Juyuso;
import com.app.dto.juyuso.LikeJuyuso;
import com.app.service.api.ArplApiService;
import com.app.service.juyuso.JuyusoService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class JuyusoServiceImpl implements JuyusoService {

    @Autowired
    JuyusoDAO juyusoDAO;

    final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public boolean insertJuyuso(Juyuso juyuso) {
        return juyusoDAO.insertJuyuso(juyuso);
    }

    @Override
    public Juyuso getJuyusoById(String uniId) {
        return juyusoDAO.getJuyusoById(uniId);
    }

    @Override
    public List<Juyuso> getAllJuyuso() {
        return juyusoDAO.getAllJuyuso();
    }

    @Override
    public boolean updateJuyuso(Juyuso juyuso) {
        return juyusoDAO.updateJuyuso(juyuso);
    }

    @Override
    public boolean deleteJuyuso(String uniId) {
        return juyusoDAO.deleteJuyuso(uniId);
    }

    @Override
    public boolean fetchAndSaveJuyusoData(double lat, double lng) {
        try {
            GeoTrans trans = new GeoTrans(1, lng, lat);
            double katecX = trans.outpt_x;
            double katecY = trans.outpt_y;
            System.out.println("Converted to KATEC: x=" + katecX + ", y=" + katecY);

            String apiResponse = ArplApiService.juyuso(String.valueOf(katecY), String.valueOf(katecX));
            JsonNode root = objectMapper.readTree(apiResponse);
            JsonNode stations = root.path("RESULT").path("OIL");

            if (stations.isMissingNode() || !stations.isArray()) {
                System.out.println("No stations found in response: " + apiResponse);
                return false;
            }

            System.out.println("Found " + stations.size() + " stations in response");

            boolean allSuccess = true;
            for (JsonNode stationNode : stations) {
                String uniId = stationNode.path("UNI_ID").asText();
                Juyuso existingJuyuso = juyusoDAO.getJuyusoById(uniId);

                Juyuso juyuso = new Juyuso();
                juyuso.setUniId(uniId);
                juyuso.setOsNm(stationNode.path("OS_NM").asText(""));
                juyuso.setNewAdr(stationNode.path("NEW_ADR").asText(""));
                juyuso.setPollDivCd(stationNode.path("POLL_DIV_CO").asText(""));
                Double hOilPrice = stationNode.path("PRICE").isMissingNode() ? null : stationNode.path("PRICE").asDouble();
                juyuso.setHOilPrice(hOilPrice);

                if (existingJuyuso == null) {
                    // DB에 없는 경우: 삽입
                    System.out.println("Inserting new juyuso: " + uniId);
                    allSuccess &= juyusoDAO.insertJuyuso(juyuso);
                    
                    // 상세 정보 가져와서 업데이트
                    Juyuso detailData = fetchDetailData(uniId);
                    if (detailData != null) {
                        allSuccess &= juyusoDAO.updateJuyusoDetail(detailData);
                    }
                } else {
                    // DB에 있는 경우: 가격 비교 후 필요 시 업데이트
                    if (!nullSafeEquals(existingJuyuso.getHOilPrice(), hOilPrice)) {
                        System.out.println("Price changed for " + uniId + ", fetching details and updating");
                        Juyuso detailData = fetchDetailData(uniId);
                        if (detailData != null) {
                            allSuccess &= juyusoDAO.updateJuyusoDetail(detailData);
                        }
                    } else {
                        System.out.println("Price unchanged for " + uniId + ", skipping update");
                    }
                }System.out.println("Inserted juyuso: " + uniId + ", success: " + juyusoDAO.insertJuyuso(juyuso));
            }
            return allSuccess;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    
    
    
    
    private boolean isJuyusoDetailComplete(Juyuso juyuso) {
        return juyuso.getTel() != null && !juyuso.getTel().isEmpty() &&
               juyuso.getVanAdr() != null && !juyuso.getVanAdr().isEmpty() &&
               juyuso.getGisXCoor() != null && juyuso.getGisYCoor() != null;
    }
    private Juyuso fetchDetailData(String uniId) throws Exception {
        String detailResponse = ArplApiService.juyusoDetail(uniId);
        JsonNode root = objectMapper.readTree(detailResponse);
        JsonNode oilNode = root.path("RESULT").path("OIL");

        if (oilNode.isMissingNode() || !oilNode.isArray() || oilNode.size() == 0) {
            System.out.println("No detail data for uniId: " + uniId);
            return null;
        }

        JsonNode detail = oilNode.get(0);
        if (detail == null) {
            return null;
        }

        Juyuso juyuso = new Juyuso();
        juyuso.setUniId(uniId);
        juyuso.setPollDivCd(detail.path("POLL_DIV_CO").asText(""));
        juyuso.setLpgYn(detail.path("LPG_YN").asText("N"));
        juyuso.setMaintYn(detail.path("MAINT_YN").asText("N"));
        juyuso.setCarWashYn(detail.path("CAR_WASH_YN").asText("N"));
        juyuso.setKpetroYn(detail.path("KPETRO_YN").asText("N"));
        juyuso.setCvsYn(detail.path("CVS_YN").asText("N"));
        juyuso.setNewAdr(detail.path("NEW_ADR").asText(""));
        juyuso.setVanAdr(detail.path("VAN_ADR").asText(""));
        juyuso.setTel(detail.path("TEL").asText(""));
        juyuso.setSiguncd(detail.path("SIGUNCD").asText(""));
        juyuso.setGisXCoor(detail.path("GIS_X_COOR").asDouble());
        juyuso.setGisYCoor(detail.path("GIS_Y_COOR").asDouble());

        JsonNode oilPrices = detail.path("OIL_PRICE");
        if (!oilPrices.isMissingNode() && oilPrices.isArray()) {
            for (JsonNode priceNode : oilPrices) {
                String prodcd = priceNode.path("PRODCD").asText();
                Double price = priceNode.path("PRICE").isMissingNode() ? null : priceNode.path("PRICE").asDouble();
                switch (prodcd) {
                    case "B027": juyuso.setHOilPrice(price); break;
                    case "B034": juyuso.setGOilPrice(price); break;
                    case "D047": juyuso.setDOilPrice(price); break;
                    case "C004": juyuso.setIOilPrice(price); break;
                    case "K015": break;
                    default: System.out.println("Unknown PRODCD: " + prodcd);
                }
            }
        }
        return juyuso;
    }

    @Override
    public boolean updateJuyusoDetail(String uniId) {
        try {
            Juyuso existingJuyuso = juyusoDAO.getJuyusoById(uniId);
            if (existingJuyuso == null) {
                System.out.println("No existing data for uniId: " + uniId + ", skipping detail update");
                return false;
            }

            Juyuso newJuyuso = fetchDetailData(uniId);
            if (newJuyuso == null) {
                System.out.println("Failed to fetch detail data for uniId: " + uniId);
                return false;
            }

            System.out.println("Detail Juyuso Data - UNI_ID: " + newJuyuso.getUniId() + 
                              ", VAN_ADR: " + newJuyuso.getVanAdr() + 
                              ", TEL: " + newJuyuso.getTel() + 
                              ", SIGUNCD: " + newJuyuso.getSiguncd() +
                              ", H_OIL_PRICE: " + newJuyuso.getHOilPrice() +
                              ", G_OIL_PRICE: " + newJuyuso.getGOilPrice() +
                              ", D_OIL_PRICE: " + newJuyuso.getDOilPrice() +
                              ", I_OIL_PRICE: " + newJuyuso.getIOilPrice());

            if (!isJuyusoDetailEqual(existingJuyuso, newJuyuso)) {
                System.out.println("Updating detail for station: " + uniId);
                return juyusoDAO.updateJuyusoDetail(newJuyuso);
            } else {
                System.out.println("Detail data unchanged for station: " + uniId + ", skipping API request");
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean isJuyusoEqual(Juyuso existing, Juyuso newData) {
        return nullSafeEquals(existing.getOsNm(), newData.getOsNm()) &&
               nullSafeEquals(existing.getNewAdr(), newData.getNewAdr()) &&
               nullSafeEquals(existing.getPollDivCd(), newData.getPollDivCd()) &&
               nullSafeEquals(existing.getHOilPrice(), newData.getHOilPrice());
    }

    private boolean isJuyusoDetailEqual(Juyuso existing, Juyuso newData) {
        return nullSafeEquals(existing.getPollDivCd(), newData.getPollDivCd()) &&
               nullSafeEquals(existing.getLpgYn(), newData.getLpgYn()) &&
               nullSafeEquals(existing.getMaintYn(), newData.getMaintYn()) &&
               nullSafeEquals(existing.getCarWashYn(), newData.getCarWashYn()) &&
               nullSafeEquals(existing.getKpetroYn(), newData.getKpetroYn()) &&
               nullSafeEquals(existing.getCvsYn(), newData.getCvsYn()) &&
               nullSafeEquals(existing.getNewAdr(), newData.getNewAdr()) &&
               nullSafeEquals(existing.getVanAdr(), newData.getVanAdr()) &&
               nullSafeEquals(existing.getTel(), newData.getTel()) &&
               nullSafeEquals(existing.getSiguncd(), newData.getSiguncd()) &&
               nullSafeEquals(existing.getGisXCoor(), newData.getGisXCoor()) &&
               nullSafeEquals(existing.getGisYCoor(), newData.getGisYCoor()) &&
               nullSafeEquals(existing.getHOilPrice(), newData.getHOilPrice()) &&
               nullSafeEquals(existing.getGOilPrice(), newData.getGOilPrice()) &&
               nullSafeEquals(existing.getDOilPrice(), newData.getDOilPrice()) &&
               nullSafeEquals(existing.getIOilPrice(), newData.getIOilPrice());
    }

    private boolean nullSafeEquals(Object a, Object b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.equals(b);
    }

    @Override
    public String getJuyusoWithDetails(double lat, double lng) {
        try {
            GeoTrans trans = new GeoTrans(1, lng, lat);
            double katecX = trans.outpt_x;
            double katecY = trans.outpt_y;
            System.out.println("Converted input to KATEC for filtering: x=" + katecX + ", y=" + katecY);

            String apiResponse = ArplApiService.juyuso(String.valueOf(katecY), String.valueOf(katecX));
            JsonNode root = objectMapper.readTree(apiResponse);
            JsonNode stations = root.path("RESULT").path("OIL");

            if (stations.isMissingNode() || !stations.isArray()) {
                System.out.println("No stations found in response: " + apiResponse);
                return objectMapper.writeValueAsString(new ResponseWrapper("OIL", objectMapper.createArrayNode()));
            }

            // enrichedStations 선언 및 초기화
            List<JsonNode> enrichedStations = new ArrayList<>();
            for (JsonNode stationNode : stations) {
                String uniId = stationNode.path("UNI_ID").asText();
                Juyuso existingJuyuso = juyusoDAO.getJuyusoById(uniId);
                Juyuso detailData;
                if (existingJuyuso != null && isJuyusoDetailComplete(existingJuyuso)) {
                    System.out.println("Using cached detail data for: " + uniId);
                    detailData = existingJuyuso;
                } else {
                    detailData = fetchDetailData(uniId);
                    if (detailData != null) {
                        juyusoDAO.updateJuyusoDetail(detailData); // DB 업데이트
                    }
                }
                if (detailData != null) {
                    JsonNode detailNode = objectMapper.valueToTree(detailData);
                    ((ObjectNode) stationNode).setAll((ObjectNode) detailNode);
                }
                enrichedStations.add(stationNode);
            }

            JsonNode resultNode = objectMapper.valueToTree(enrichedStations);
            String response = objectMapper.writeValueAsString(new ResponseWrapper("OIL", resultNode));
            System.out.println("Returning juyuso data: " + response);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }

    private static class ResponseWrapper {
        public String key;
        public JsonNode value;

        public ResponseWrapper(String key, JsonNode value) {
            this.key = key;
            this.value = value;
        }
    }

    @Override
    public boolean registerFavoriteStation(String userId, String uniId) {
        try {
            // 중복 체크
            int exists = juyusoDAO.checkFavoriteStationExists(userId, uniId);
            if (exists > 0) {
                System.out.println("Already registered: userId=" + userId + ", uniId=" + uniId);
                return false;
            }

            LikeJuyuso likeJuyuso = new LikeJuyuso();
            likeJuyuso.setUserId(userId);
            likeJuyuso.setUniId(uniId);

            return juyusoDAO.insertFavoriteStation(likeJuyuso);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReviewsByStationId(String uniId) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> reviews = juyusoDAO.getReviewsByStationId(uniId);
        System.out.println("DAO returned reviews for uniId " + uniId + ": " + reviews);

        double avgRating = reviews.stream()
            .mapToDouble(r -> {
                Object starCnt = r.get("STARCNT");
                return starCnt != null ? Double.parseDouble(starCnt.toString()) : 0.0;
            })
            .average()
            .orElse(0.0);

        result.put("reviews", reviews);
        result.put("averageRating", avgRating);
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Integer> getKeywordsByStationAndUser(String uniId, String userId) {
        System.out.println("Fetching keywords for uniId " + uniId + ", userId " + userId);
        List<Integer> keywords = juyusoDAO.getKeywordsByStationAndUser(uniId, userId);
        System.out.println("DAO returned keywords: " + keywords);
        return keywords;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Integer> getAllKeywordsCountByStation(String uniId) {
        List<Map<String, Object>> keywordStats = juyusoDAO.getAllKeywordsStatsByStation(uniId);
        System.out.println("Keyword stats for uniId " + uniId + ": " + keywordStats); // 디버깅 로그
        Map<Integer, Integer> keywordCounts = new HashMap<>();
        for (Map<String, Object> stat : keywordStats) {
            Number keywordIdNumber = (Number) stat.get("KEYWORD_ID");
            Number countNumber = (Number) stat.get("COUNT");
            if (keywordIdNumber != null && countNumber != null) {
                Integer keywordId = keywordIdNumber.intValue();
                Integer count = countNumber.intValue();
                keywordCounts.put(keywordId, count);
            } else {
                System.out.println("Null value detected in stats: " + stat);
            }
        }
        return keywordCounts;
    }
    
    @Transactional
    @Override
    public boolean saveReview(String userId, String uniId, String content, double starCnt) {
        System.out.println("Saving review - userId: " + userId + ", uniId: " + uniId + ", starCnt: " + starCnt + ", content: " + content);
        Map<String, Object> review = new HashMap<>();
        review.put("uniId", uniId);
        review.put("userId", userId);
        review.put("starCnt", starCnt);
        review.put("content", content);
        int result = juyusoDAO.insertReview(review);
        System.out.println("Inserted review for uniId " + uniId + ": " + result);
        return result > 0;
    }

    @Override
    @Transactional
    public boolean saveKeywords(String userId, String uniId, List<Integer> keywords) {
        // 기존 키워드 삭제 (중복 방지)
        Map<String, Object> param = new HashMap<>();
        param.put("userId", userId);
        param.put("uniId", uniId);
        juyusoDAO.deleteKeywordsByUserAndStation(param);

        // 새 키워드 삽입
        boolean success = true;
        for (Integer keyword : keywords) {
            param.put("keyword", keyword);
            int result = juyusoDAO.insertKeyword(param);
            if (result <= 0) success = false;
        }
        return success;
    }

    @Transactional
    @Override
    public boolean deleteReview(String userId, String uniId, String content) {
        Map<String, Object> param = new HashMap<>();
        param.put("userId", userId);
        param.put("uniId", uniId);
        param.put("content", content);
        int result = juyusoDAO.deleteReview(param);
        System.out.println("Deleted review for userId: " + userId + ", uniId: " + uniId + ", result: " + result);
        return result > 0;
    }
    
    @Override
	public List<BlackJuyuso> findProcessedAllBlackList() {
		
		List<BlackJuyuso> blackList = juyusoDAO.findProcessedAllBlackList();
		
		return blackList;
	}
    
    @Override
	public List<BlackJuyuso> findProcessedBlackList() {
		
		List<BlackJuyuso> blackList = juyusoDAO.findProcessedBlackList();
		
		return blackList;
	}

	@Override
	public List<BlackJuyuso> findBlackList() {
		
		List<BlackJuyuso> blackList = juyusoDAO.findBlackList();
		
		return blackList;
	}

	@Override
	public int modifyBlack(String uniId) {
		
		int result = juyusoDAO.modifyBlack(uniId);
		
		return result;
	}

	@Override
	public int removeBlack(String uniId) {
		
		int result = juyusoDAO.removeBlack(uniId);
		
		return result;
	}
}