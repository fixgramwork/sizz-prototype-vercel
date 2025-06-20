-- 대화 히스토리 테이블
CREATE TABLE IF NOT EXISTS CHAT_HISTORIES (
    ID UUID PRIMARY KEY DEFAULT UUID_GENERATE_V4(),
    USER_ID UUID NOT NULL REFERENCES USERS(ID) ON DELETE CASCADE,
    ARTICLE_ID UUID NOT NULL REFERENCES ARTICLES(ID) ON DELETE CASCADE,
    MESSAGES JSONB NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS IDX_CHAT_HISTORIES_USER_ARTICLE ON CHAT_HISTORIES(USER_ID, ARTICLE_ID);