'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navigation } from '@/components/layouts/Navigation';
import { TrendingUp, BarChart3, Target, Users } from 'lucide-react';

interface BiasData {
    biasScores: {
        left: number;
        center: number;
        right: number;
    };
    oppositeArticles: Array<{
        id: string;
        title: string;
        source: string;
        bias: string;
    }>;
}

export default function BiasAnalysisPage() {
    const { user, isLoaded } = useUser();
    const [biasData, setBiasData] = useState<BiasData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBiasData() {
            if (!isLoaded || !user) return;

            try {
                const response = await fetch('/api/bias');
                if (response.ok) {
                    const data = await response.json();
                    setBiasData(data);
                }
            } catch (error) {
                console.error('성향 데이터 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchBiasData();
    }, [isLoaded, user]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">성향을 분석하고 있습니다...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-2xl mx-auto py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다.</h2>
                    <p className="text-gray-600">성향 분석을 이용하려면 로그인해주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* 히어로 섹션 */}
            <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                <TrendingUp className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            내 뉴스 성향 분석
                        </h1>
                        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
                            당신의 뉴스 읽기 패턴을 분석하여 정치적 성향을 파악하고,
                            균형 잡힌 정보 소비를 도와드립니다
                        </p>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {biasData ? (
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* 성향 점수 카드 */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">성향 점수</h2>
                            </div>

                            <div className="space-y-6">
                                {/* 진보 성향 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">진보 성향</span>
                                        <span className="text-sm font-medium text-blue-600">{biasData.biasScores.left}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                                            style={{ width: `${biasData.biasScores.left}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* 중립 성향 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-600">중립 성향</span>
                                        <span className="text-sm font-medium text-gray-600">{biasData.biasScores.center}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gray-500 h-3 rounded-full transition-all duration-1000"
                                            style={{ width: `${biasData.biasScores.center}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* 보수 성향 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-red-600">보수 성향</span>
                                        <span className="text-sm font-medium text-red-600">{biasData.biasScores.right}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-red-600 h-3 rounded-full transition-all duration-1000"
                                            style={{ width: `${biasData.biasScores.right}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>분석 결과:</strong>
                                    {biasData.biasScores.left > biasData.biasScores.right
                                        ? ' 진보적 성향이 강합니다. 다양한 관점의 기사를 읽어보세요.'
                                        : biasData.biasScores.right > biasData.biasScores.left
                                            ? ' 보수적 성향이 강합니다. 다양한 관점의 기사를 읽어보세요.'
                                            : ' 균형 잡힌 성향을 보입니다. 좋습니다!'}
                                </p>
                            </div>
                        </div>

                        {/* 다양한 관점 추천 */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <div className="flex items-center mb-6">
                                <Target className="w-8 h-8 text-green-600 mr-3" />
                                <h2 className="text-2xl font-bold text-gray-900">다양한 관점 추천</h2>
                            </div>

                            <div className="space-y-4">
                                {biasData.oppositeArticles.map((article) => (
                                    <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">{article.source}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${article.bias === 'left'
                                                ? 'bg-blue-100 text-blue-800'
                                                : article.bias === 'right'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {article.bias === 'left' ? '진보' : article.bias === 'right' ? '보수' : '중립'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-800">
                                    🌟 <strong>팁:</strong> 다양한 관점의 기사를 읽으면
                                    더 균형 잡힌 시각을 가질 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">아직 충분한 데이터가 없습니다</h3>
                        <p className="text-gray-600 mb-6">
                            더 많은 기사를 읽고 투표해주시면 정확한 성향 분석을 제공해드릴 수 있습니다.
                        </p>
                        <a
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            뉴스 둘러보기
                        </a>
                    </div>
                )}
            </main>
        </div>
    );
} 