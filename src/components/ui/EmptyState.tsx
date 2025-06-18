import { ReactNode } from 'react';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    actions?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    actions,
    className = ""
}: EmptyStateProps) {
    return (
        <div className={`text-center py-20 bg-white rounded-lg shadow hover-lift animate-fade-in-up ${className}`}>
            <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            {actions && (
                <div className="flex justify-center space-x-4">
                    {actions}
                </div>
            )}
        </div>
    );
} 