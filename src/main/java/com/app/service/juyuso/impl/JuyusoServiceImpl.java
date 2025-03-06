package com.app.service.juyuso.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.controller.juyuso.GeoTrans;
import com.app.dao.juyuso.JuyusoDAO;
import com.app.dto.juyuso.Juyuso;
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

            for (JsonNode stationNode : stations) {
                String uniId = stationNode.path("UNI_ID").asText();
                Double apiPrice = stationNode.path("PRICE").isMissingNode() ? null : stationNode.path("PRICE").asDouble();

                Juyuso existingJuyuso = juyusoDAO.getJuyusoById(uniId);
                boolean needsUpdate = false;

                if (existingJuyuso == null) {
                    // DB에 없으면 새로 삽입
                    Juyuso newJuyuso = new Juyuso();
                    newJuyuso.setUniId(uniId);
                    newJuyuso.setOsNm(stationNode.path("OS_NM").asText());
                    newJuyuso.setHOilPrice(apiPrice);
                    newJuyuso.setNewAdr(stationNode.path("NEW_ADR").asText(""));
                    newJuyuso.setPollDivCd(stationNode.path("POLL_DIV_CO").asText(""));

                    System.out.println("Inserting new station: " + uniId);
                    juyusoDAO.insertJuyuso(newJuyuso);
                    needsUpdate = true; // 상세 정보 업데이트 필요
                } else {
                    // DB에 존재하면 가격 비교
                    Double dbHOilPrice = existingJuyuso.getHOilPrice();
                    if (!nullSafeEquals(dbHOilPrice, apiPrice)) {
                        // 가격이 다르면 업데이트
                        existingJuyuso.setHOilPrice(apiPrice);
                        System.out.println("Updating station price for: " + uniId + " from " + dbHOilPrice + " to " + apiPrice);
                        juyusoDAO.updateJuyuso(existingJuyuso);
                        needsUpdate = true; // 상세 정보 업데이트 필요
                    } else {
                        System.out.println("Price unchanged for station: " + uniId + ", skipping update");
                    }
                }

                // 가격이 변경되었거나 새로 삽입된 경우에만 상세 정보 업데이트
                if (needsUpdate) {
                    updateJuyusoDetail(uniId);
                } else {
                    System.out.println("No price change for: " + uniId + ", skipping detail API request");
                }
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
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

            // API 응답을 그대로 사용하며, 상세 정보를 추가
            List<JsonNode> enrichedStations = new java.util.ArrayList<>();
            for (JsonNode stationNode : stations) {
                Juyuso detailData = fetchDetailData(stationNode.path("UNI_ID").asText());
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
}