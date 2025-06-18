import { ReactNode } from 'react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Lightbulb } from 'lucide-react';

interface BiasScores {
    left: number;
    center: number;
    right: number;
}

interface BiasTypeCardProps {
    icon: string;
    title: string;
    description: string;
    biasScores: BiasScores;
    className?: string;
}

export function BiasTypeCard({
    icon,
    title,
    description,
    biasScores,
    className = ""
}: BiasTypeCardProps) {
    const getAnalysisResult = () => {
        if (biasScores.left > biasScores.right) {
            return '진보적 성향이 강합니다. 다양한 관점의 기사를 읽어보세요.';
        } else if (biasScores.right > biasScores.left) {
            return '보수적 성향이 강합니다. 다양한 관점의 기사를 읽어보세요.';
        } else {
            return '균형 잡힌 성향을 보입니다. 좋습니다!';
        }
    };

    return (
        <div className={`lg:col-span-2 bg-white rounded-lg shadow-lg p-8 hover-lift ${className}`}>
            <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">{icon}</span>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>

            <div className="space-y-6">
                <ProgressBar
                    value={biasScores.left}
                    label="진보 성향"
                    color="blue"
                />
                <ProgressBar
                    value={biasScores.center}
                    label="중립 성향"
                    color="gray"
                />
                <ProgressBar
                    value={biasScores.right}
                    label="보수 성향"
                    color="red"
                />
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                    <Lightbulb className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                        <strong>분석 결과:</strong> {getAnalysisResult()}
                    </p>
                </div>
            </div>
        </div>
    );
} 