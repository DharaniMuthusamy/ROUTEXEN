import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-[#0033A0]">404</h1>
                </div>

                <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 mb-8">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-[#0033A0] text-white px-6 py-3 rounded-lg hover:bg-[#002d8f] transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span>Go Home</span>
                    </button>

                    <button
                        onClick={() => navigate('/search')}
                        className="flex items-center gap-2 bg-white text-[#0033A0] border-2 border-[#0033A0] px-6 py-3 rounded-lg hover:bg-[#E8F1FF] transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        <span>Search Flights</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
