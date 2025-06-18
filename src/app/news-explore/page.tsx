'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navigation } from '@/components/layouts/Navigation';
import { NewsCard } from '@/components/NewsCard';
import { getVoteForArticle } from '@/lib/services/votes';
import { Database } from '@/types/database';
import { Newspaper, Search, TrendingUp } from 'lucide-react';

type Article = Database['public']['Tables']['articles']['Row'];

export default function NewsExplorePage() {
    const { user, isLoaded } = useUser();
    const [articles, setArticles] = useState<(Article & { userVote: boolean | null })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBias, setSelectedBias] = useState<string>('all');

    useEffect(() => {
        async function fetchArticles() {
            try {
                const response = await fetch('/api/news');
                if (response.ok) {
                    const fetchedArticles = await response.json();

                    // 사용자 투표 정보 가져오기
                    if (user) {
                        const articlesWithVotes = await Promise.all(
                            fetchedArticles.map(async (article: Article) => {
                                const vote = await getVoteForArticle(article.id);
                                return { ...article, userVote: vote };
                            })
                        );
                        setArticles(articlesWithVotes);
                    } else {
                        const articlesWithVotes = fetchedArticles.map((article: Article) => ({
                            ...article,
                            userVote: null
                        }));
                        setArticles(articlesWithVotes);
                    }
                }
            } catch (error) {
                console.error('뉴스 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchArticles();
    }, [user]);

    // 필터링된 기사들
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBias = selectedBias === 'all' || article.bias === selectedBias;

        return matchesSearch && matchesBias;
    });

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">뉴스를 불러오고 있습니다...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* 히어로 섹션 */}
            <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-16 animate-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center animate-fade-in-up">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                <Newspaper className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            뉴스 둘러보기
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            다양한 관점의 뉴스를 탐색하고, 균형 잡힌 정보 소비를 경험해보세요
                        </p>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 필터 및 검색 섹션 */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="grid gap-4 md:grid-cols-3">
                        {/* 검색 */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="뉴스 제목이나 내용으로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* 성향 필터 */}
                        <div>
                            <select
                                value={selectedBias}
                                onChange={(e) => setSelectedBias(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">모든 성향</option>
                                <option value="left">진보</option>
                                <option value="center">중립</option>
                                <option value="right">보수</option>
                            </select>
                        </div>
                    </div>

                    {/* 필터 결과 표시 */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                            <span>총 {filteredArticles.length}개의 기사</span>
                            {(searchTerm || selectedBias !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedBias('all');
                                    }}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    필터 초기화
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 뉴스 목록 */}
                {filteredArticles.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow animate-fade-in-up">
                        <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                        <p className="text-gray-600 mb-6">
                            다른 검색어나 필터를 시도해보세요.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedBias('all');
                            }}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            모든 뉴스 보기
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {filteredArticles.map((article, idx) => (
                            <div key={article.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                                <NewsCard article={article} />
                            </div>
                        ))}
                    </div>
                )}

                {/* 추천 섹션 */}
                {user && (
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 animate-fade-in-up">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                개인화된 추천
                            </h2>
                            <p className="text-gray-600 mb-6">
                                더 정확한 뉴스 추천을 받으려면 성향 분석을 해보세요.
                            </p>
                            <a
                                href="/bias-analysis"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                내 성향 분석하기
                            </a>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
} 