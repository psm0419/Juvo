package com.app.dao.chargingstation.Impl;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.chargingstation.ChargingStationDAO;
import com.app.dto.chargingstation.ChargingStationDTO;

@Repository
public class ChargingStationDAOImpl implements ChargingStationDAO {

    @Autowired
    private SqlSessionTemplate sqlSessionTemplate;

    private static final String NAMESPACE = "com.app.dao.chargingstation.ChargingStationDAO";

    @Override
    public void insertChargingStation(ChargingStationDTO dto) {
        sqlSessionTemplate.insert(NAMESPACE + ".insertChargingStation", dto);
    }
}