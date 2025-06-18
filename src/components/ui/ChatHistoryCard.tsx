import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChatHistoryCardProps {
    id: string;
    articleId: string;
    updatedAt: string;
    messages: Array<{ content: string }>;
    article?: {
        title?: string;
        source?: string;
        bias?: string;
    };
    onDelete?: (articleId: string) => void;
}

export function ChatHistoryCard({
    id,
    articleId,
    updatedAt,
    messages,
    article,
    onDelete
}: ChatHistoryCardProps) {
    return (
        <div className="bg-white rounded-lg shadow p-4 hover-lift animate-fade-in-up">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-lg">
                        {article?.title || '제목 없음'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {article?.source} ·
                        {article?.bias === 'left' ? '진보' :
                            article?.bias === 'right' ? '보수' : '중립'}
                    </p>
                </div>
                <div className="text-sm text-gray-500">
                    {format(new Date(updatedAt), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
                마지막 대화: {messages[messages.length - 1]?.content.slice(0, 100)}...
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <Link
                    href={`/article/${articleId}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                >
                    기사 보기
                </Link>
                {onDelete && (
                    <button
                        onClick={() => onDelete(articleId)}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                        삭제
                    </button>
                )}
            </div>
        </div>
    );
} 