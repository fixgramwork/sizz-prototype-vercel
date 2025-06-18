import { ReactNode } from 'react';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    gradient?: string;
    className?: string;
}

export function HeroSection({
    title,
    subtitle,
    icon,
    gradient = "from-indigo-600 via-purple-600 to-pink-600",
    className = ""
}: HeroSectionProps) {
    return (
        <section className={`bg-gradient-to-br ${gradient} text-white py-16 animate-gradient ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center animate-fade-in-up">
                    <div className="flex justify-center mb-6">
                        <div className="card-glass rounded-full p-4">
                            {icon}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        {title}
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                        {subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
} 