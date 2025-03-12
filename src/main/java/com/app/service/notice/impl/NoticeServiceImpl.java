package com.app.service.notice.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.app.dao.notice.NoticeDAO;
import com.app.dto.notice.NoticeDTO;
import com.app.service.notice.NoticeService;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeDAO noticeDAO;
    
    @Override
    public List<NoticeDTO> getNoticeList() {
        return noticeDAO.getNoticeList();
    }

    @Override
    public NoticeDTO getNoticeDetail(int noticeId) {
        return noticeDAO.getNoticeDetail(noticeId);
    }
}
