package com.app.dao.notice.impl;

import java.util.List;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.app.dao.notice.NoticeDAO;
import com.app.dto.notice.NoticeDTO;

@Repository
public class NoticeDAOImpl implements NoticeDAO {

    @Autowired
    private SqlSession sqlSession;
    
    // MyBatis 매퍼 네임스페이스
    private static final String NS = "noticeMapper";

    @Override
    public List<NoticeDTO> getNoticeList() {
        return sqlSession.selectList(NS + ".getNoticeList"); // 점(.) 추가
    }

    @Override
    public NoticeDTO getNoticeDetail(int noticeId) {
        return sqlSession.selectOne(NS + ".getNoticeDetail", noticeId); // 점(.) 추가
    }
}