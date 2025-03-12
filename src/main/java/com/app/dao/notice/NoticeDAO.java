package com.app.dao.notice;

import java.util.List;
import com.app.dto.notice.NoticeDTO;

public interface NoticeDAO {
    // 공지사항 목록 (번호, 제목, 작성일) 조회
    List<NoticeDTO> getNoticeList();
    
    // 공지사항 상세 (공지번호에 해당하는 모든 정보) 조회
    NoticeDTO getNoticeDetail(int noticeId);
}
