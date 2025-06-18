import { ReactNode } from 'react';

interface Tab {
    id: string;
    label: string;
    icon: ReactNode;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    className?: string;
}

export function TabNavigation({
    tabs,
    activeTab,
    onTabChange,
    className = ""
}: TabNavigationProps) {
    return (
        <div className={`flex justify-center mb-8 ${className}`}>
            <div className="bg-white rounded-lg shadow-lg p-1">
                <div className="flex space-x-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all hover-lift ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 