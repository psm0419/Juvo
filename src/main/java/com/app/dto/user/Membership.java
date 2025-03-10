package com.app.dto.user;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Membership {
    private String user_id;          // 사용자 ID
    private int subscription;        // 구독 여부 (0: 미구독, 1: 구독)
    private int months_subscribed;   // 구독 개월 수
    private LocalDateTime start_date; // 구독 시작일
    private int next_reward_months;  // 다음 혜택까지 남은 개월 수
}