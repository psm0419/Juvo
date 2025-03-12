package com.app.service.notice;

import java.util.List;
import com.app.dto.notice.NoticeDTO;

public interface NoticeService {
    List<NoticeDTO> getNoticeList();
    NoticeDTO getNoticeDetail(int noticeId);
}
