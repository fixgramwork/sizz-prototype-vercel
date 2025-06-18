import { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    color?: 'blue' | 'red' | 'green' | 'purple' | 'gray';
    className?: string;
}

export function StatCard({
    icon,
    label,
    value,
    color = 'blue',
    className = ""
}: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        gray: 'bg-gray-50 text-gray-600'
    };

    const [bgColor, textColor] = colorClasses[color].split(' ');

    return (
        <div className={`flex items-center justify-between p-3 ${bgColor} rounded-lg ${className}`}>
            <div className="flex items-center">
                <div className={`w-5 h-5 ${textColor} mr-2`}>
                    {icon}
                </div>
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className={`font-semibold ${textColor}`}>
                {value}
            </span>
        </div>
    );
} 