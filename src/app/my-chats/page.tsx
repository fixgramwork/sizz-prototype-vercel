'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navigation } from '@/components/layouts/Navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroSection } from '@/components/ui/HeroSection';
import { ChatHistoryCard } from '@/components/ui/ChatHistoryCard';
import { MessageCircle, Users } from 'lucide-react';

interface ChatHistory {
    id: string;
    article_id: string;
    updated_at: string;
    messages: Array<{ content: string }>;
    articles?: {
        title?: string;
        source?: string;
        bias?: string;
    };
}

export default function MyChatsPage() {
    const { user, isLoaded } = useUser();
    const [histories, setHistories] = useState<ChatHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded || !user) return;
        async function fetchHistories() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/chat-history');
                if (!res.ok) throw new Error('대화 기록을 불러오지 못했습니다.');
                const data = await res.json();
                setHistories(data.histories || []);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchHistories();
    }, [isLoaded, user]);

    const handleDelete = async (articleId: string) => {
        if (!confirm('정말로 이 대화를 삭제하시겠습니까?')) return;
        try {
            await fetch(`/api/chat-history?articleId=${articleId}`, { method: 'DELETE' });
            setHistories((prev) => prev.filter((h) => h.article_id !== articleId));
        } catch {
            alert('삭제에 실패했습니다.');
        }
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <LoadingSpinner message="대화 기록을 불러오고 있습니다..." />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <EmptyState
                    icon={<Users />}
                    title="로그인이 필요합니다."
                    description="대화 기록을 보려면 로그인해주세요."
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <HeroSection
                title="나의 대화 히스토리"
                subtitle="AI와 나눈 뉴스 관련 대화 기록을 한눈에 확인하세요."
                icon={<MessageCircle className="w-12 h-12 text-white" />}
                gradient="from-blue-600 via-indigo-600 to-purple-700"
            />
            <main className="max-w-3xl mx-auto px-4 py-12">
                {error && (
                    <div className="text-center text-red-500 mb-6">{error}</div>
                )}
                {histories.length === 0 ? (
                    <EmptyState
                        icon={<MessageCircle className="w-16 h-16 mx-auto" />}
                        title="아직 저장된 대화가 없습니다."
                        description="뉴스 기사에서 AI와 대화를 시작해보세요!"
                    />
                ) : (
                    <div className="space-y-4">
                        {histories.map((history) => (
                            <ChatHistoryCard
                                key={history.id}
                                id={history.id}
                                articleId={history.article_id}
                                updatedAt={history.updated_at}
                                messages={history.messages}
                                article={history.articles}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
} 