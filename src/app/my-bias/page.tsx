'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navigation } from '@/components/layouts/Navigation';
import { TrendingUp, BarChart3, Target, Users, Brain } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HeroSection } from '@/components/ui/HeroSection';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { EmptyState } from '@/components/ui/EmptyState';
import { BiasTypeCard } from '@/components/bias/BiasTypeCard';
import { StatsCard } from '@/components/bias/StatsCard';

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
    stats?: {
        totalVotes: number;
        agreeVotes: number;
        disagreeVotes: number;
        articlesRead: number;
    };
    dominantBias?: string;
}

export default function MyBiasPage() {
    const { user, isLoaded } = useUser();
    const [biasData, setBiasData] = useState<BiasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');

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
                <LoadingSpinner message="성향을 분석하고 있습니다..." />
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
                    description="성향 분석을 이용하려면 로그인해주세요."
                />
            </div>
        );
    }

    const getBiasType = () => {
        if (!biasData) return 'neutral';
        const { left, center, right } = biasData.biasScores;
        if (left > right && left > center) return 'progressive';
        if (right > left && right > center) return 'conservative';
        return 'neutral';
    };

    const getBiasDescription = () => {
        const biasType = getBiasType();
        switch (biasType) {
            case 'progressive':
                return {
                    title: '진보적 성향',
                    description: '사회적 변화와 진보를 중시하는 성향을 보입니다.',
                    icon: '🌱',
                    tips: [
                        '다양한 관점의 기사를 읽어보세요',
                        '객관적 사실 확인을 습관화하세요',
                        '편향된 정보에 대한 인식을 높이세요'
                    ]
                };
            case 'conservative':
                return {
                    title: '보수적 성향',
                    description: '전통과 안정을 중시하는 성향을 보입니다.',
                    icon: '🏛️',
                    tips: [
                        '다양한 관점의 기사를 읽어보세요',
                        '객관적 사실 확인을 습관화하세요',
                        '편향된 정보에 대한 인식을 높이세요'
                    ]
                };
            default:
                return {
                    title: '균형 잡힌 성향',
                    description: '다양한 관점을 균형있게 고려하는 성향을 보입니다.',
                    icon: '⚖️',
                    tips: [
                        '훌륭합니다! 균형 잡힌 시각을 유지하세요',
                        '정기적으로 성향을 재분석해보세요',
                        '다양한 정보 소스를 활용하세요'
                    ]
                };
        }
    };
    const biasInfo = getBiasDescription();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <HeroSection
                title="내 뉴스 성향 분석"
                subtitle="당신의 뉴스 읽기 패턴을 분석하여 정치적 성향을 파악하고, 균형 잡힌 정보 소비를 도와드립니다"
                icon={<TrendingUp className="w-12 h-12 text-white" />}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <TabNavigation
                    tabs={[
                        { id: 'overview', label: '개요', icon: <BarChart3 className="w-4 h-4" /> },
                        { id: 'details', label: '상세 분석', icon: <Brain className="w-4 h-4" /> },
                        { id: 'recommendations', label: '추천', icon: <Target className="w-4 h-4" /> }
                    ]}
                    activeTab={activeTab}
                    onTabChange={(tabId) => setActiveTab(tabId as 'overview' | 'details' | 'recommendations')}
                />
                {biasData ? (
                    <div className="space-y-8">
                        {activeTab === 'overview' && (
                            <div className="grid gap-8 lg:grid-cols-3 animate-fade-in-up">
                                <BiasTypeCard
                                    icon={biasInfo.icon}
                                    title={biasInfo.title}
                                    description={biasInfo.description}
                                    biasScores={biasData.biasScores}
                                />
                                <StatsCard stats={biasData.stats!} />
                            </div>
                        )}
                        {activeTab === 'details' && (
                            <div className="bg-white rounded-lg shadow-lg p-8 hover-lift animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">상세 분석</h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">성향 분석 방법</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <p>• 뉴스 기사에 대한 찬반 투표 패턴 분석</p>
                                            <p>• 읽은 기사의 정치적 성향 분포</p>
                                            <p>• 시간에 따른 성향 변화 추적</p>
                                            <p>• 다른 사용자와의 비교 분석</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">개선 제안</h3>
                                        <div className="space-y-3 text-sm text-gray-600">
                                            {biasInfo.tips.map((tip, index) => (
                                                <p key={index}>• {tip}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'recommendations' && (
                            <div className="bg-white rounded-lg shadow-lg p-8 hover-lift animate-fade-in-up">
                                <div className="flex items-center mb-6">
                                    <Target className="w-8 h-8 text-green-600 mr-3" />
                                    <h2 className="text-2xl font-bold text-gray-900">다양한 관점 추천</h2>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {biasData.oppositeArticles.map((article, index) => (
                                        <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover-lift transition-all duration-200" style={{ animationDelay: `${index * 100}ms` }}>
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center justify-between mb-3">
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
                                            <a
                                                href={`/news-explore`}
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                            >
                                                기사 보기
                                            </a>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <span className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0">🌟</span>
                                        <p className="text-sm text-green-800">
                                            <strong>팁:</strong> 다양한 관점의 기사를 읽으면 더 균형 잡힌 시각을 가질 수 있습니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Users />}
                        title="아직 충분한 데이터가 없습니다"
                        description="더 많은 기사를 읽고 투표해주시면 정확한 성향 분석을 제공해드릴 수 있습니다."
                        actions={
                            <>
                                <a
                                    href="/news-explore"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors hover-lift"
                                >
                                    뉴스 둘러보기
                                </a>
                                <a
                                    href="/"
                                    className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors hover-lift"
                                >
                                    홈으로 돌아가기
                                </a>
                            </>
                        }
                    />
                )}
            </main>
        </div>
    );
} 