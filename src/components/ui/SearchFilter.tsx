import { Search } from 'lucide-react';

interface SearchFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedBias: string;
    onBiasChange: (value: string) => void;
    totalCount: number;
    onReset?: () => void;
    className?: string;
}

export function SearchFilter({
    searchTerm,
    onSearchChange,
    selectedBias,
    onBiasChange,
    totalCount,
    onReset,
    className = ""
}: SearchFilterProps) {
    const hasFilters = searchTerm || selectedBias !== 'all';

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 mb-8 ${className}`}>
            <div className="grid gap-4 md:grid-cols-3">
                {/* 검색 */}
                <div className="md:col-span-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="뉴스 제목이나 내용으로 검색..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* 성향 필터 */}
                <div>
                    <select
                        value={selectedBias}
                        onChange={(e) => onBiasChange(e.target.value)}
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
                    <span>총 {totalCount}개의 기사</span>
                    {hasFilters && onReset && (
                        <button
                            onClick={onReset}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            필터 초기화
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 