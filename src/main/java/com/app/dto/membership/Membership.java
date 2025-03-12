package com.app.dto.membership;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class Membership {
    private Long id;
    private String userId; // Long → String으로 변경
    private String name;
    private String phone;
    private String address;
    private String detailAddress;
    private String cardCompany;
    private String cardNumber;
    private String cvc;
    private String expiry;
    private Timestamp createdAt;
}