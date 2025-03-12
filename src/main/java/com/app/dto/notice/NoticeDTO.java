package com.app.dto.notice;
import java.util.Date;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class NoticeDTO {
    private int noticeId;
    private String title;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createdDate;
}