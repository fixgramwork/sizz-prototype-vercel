interface ProgressBarProps {
    value: number;
    max?: number;
    label: string;
    color?: 'blue' | 'red' | 'green' | 'gray' | 'purple';
    showPercentage?: boolean;
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    label,
    color = 'blue',
    showPercentage = true,
    className = ""
}: ProgressBarProps) {
    const percentage = Math.round((value / max) * 100);

    const colorClasses = {
        blue: 'bg-blue-600 text-blue-600',
        red: 'bg-red-600 text-red-600',
        green: 'bg-green-600 text-green-600',
        gray: 'bg-gray-500 text-gray-600',
        purple: 'bg-purple-600 text-purple-600'
    };

    const [bgColor, textColor] = colorClasses[color].split(' ');

    return (
        <div className={className}>
            <div className="flex justify-between mb-2">
                <span className={`text-sm font-medium ${textColor}`}>{label}</span>
                {showPercentage && (
                    <span className={`text-sm font-medium ${textColor}`}>{percentage}%</span>
                )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                    className={`${bgColor} h-3 rounded-full transition-all duration-1000 progress-animate`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
} 