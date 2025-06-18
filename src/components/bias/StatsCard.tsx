import { StatCard } from '@/components/ui/StatCard';
import { ThumbsUp, ThumbsDown, Eye, Sparkles } from 'lucide-react';

interface Stats {
    totalVotes: number;
    agreeVotes: number;
    disagreeVotes: number;
    articlesRead: number;
}

interface StatsCardProps {
    stats: Stats;
    className?: string;
}

export function StatsCard({ stats, className = "" }: StatsCardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 hover-lift ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">활동 통계</h3>
            <div className="space-y-4">
                <StatCard
                    icon={<ThumbsUp />}
                    label="찬성 투표"
                    value={stats.agreeVotes}
                    color="blue"
                />
                <StatCard
                    icon={<ThumbsDown />}
                    label="반대 투표"
                    value={stats.disagreeVotes}
                    color="red"
                />
                <StatCard
                    icon={<Eye />}
                    label="읽은 기사"
                    value={stats.articlesRead}
                    color="green"
                />
                <StatCard
                    icon={<Sparkles />}
                    label="총 투표"
                    value={stats.totalVotes}
                    color="purple"
                />
            </div>
        </div>
    );
} 