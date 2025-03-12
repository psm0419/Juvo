package com.app.controller.notice;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.app.dto.notice.NoticeDTO;
import com.app.service.notice.NoticeService;

@RestController
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;
    
    // 공지사항 목록을 JSON으로 반환
    @GetMapping("/list")
    public List<NoticeDTO> listNotices() {
        return noticeService.getNoticeList();
    }
    
    // 공지사항 상세 정보를 JSON으로 반환
    @GetMapping("/detail/{noticeId}")
    public NoticeDTO noticeDetail(@PathVariable("noticeId") int noticeId) {
        return noticeService.getNoticeDetail(noticeId);
    }
}
