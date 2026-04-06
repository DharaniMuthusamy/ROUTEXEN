import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import {
    Search,
    Users,
    ArrowRight,
    Plane,
    Shield,
    Clock,
    Headphones,
    Star,
    CreditCard,
    Globe,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { AirportCombobox } from "../components/AirportCombobox.jsx";
import { DatePickerPopover } from "../components/DatePickerPopover.jsx";
import { PassengerSelector } from "../components/PassengerSelector.jsx";

// ── Hero carousel images (Unsplash – royalty-free) ──
const HERO_IMAGES = [
    {
        url: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1920&q=80",
        alt: "Commercial airplane flying through golden clouds",
    },
    {
        url: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1920&q=80",
        alt: "Aerial view from airplane window showing landscape",
    },
    {
        url: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1920&q=80",
        alt: "Airplane on runway during blue hour twilight",
    },
    {
        url: "https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1920&q=80",
        alt: "Airplane silhouette against vibrant sunset sky",
    },
];

export function LandingPage() {
    const navigate = useNavigate();
    const [searchData, setSearchData] = useState({
        from: "",
        to: "",
        departDate: "",
        returnDate: "",
        passengers: 1,
    });
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchData.from || !searchData.to || !searchData.departDate) return;
        navigate("/search", { state: searchData });
    };

    // ── Preload images ──
    useEffect(() => {
        HERO_IMAGES.forEach((img, i) => {
            const image = new Image();
            image.src = img.url;
            image.onload = () => setImagesLoaded((prev) => [...prev, i]);
        });
    }, []);

    // ── Auto-advance carousel every 5s ──
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const features = [
        { icon: Shield, title: "Secure Booking", description: "Bank-grade encryption protects your payments and data", color: "from-emerald-500 to-teal-600" },
        { icon: CreditCard, title: "Best Prices", description: "Compare fares across 50+ airlines for the lowest prices", color: "from-violet-500 to-purple-600" },
        { icon: Headphones, title: "24/7 Support", description: "Our dedicated team is always here to help you", color: "from-amber-500 to-orange-600" },
        { icon: Clock, title: "Instant Confirmation", description: "Get your e-ticket and boarding pass instantly", color: "from-sky-500 to-blue-600" },
    ];

    return (
        <div className="bg-white overflow-hidden">
            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <div className="relative min-h-screen overflow-hidden">
                {/* ── Image Carousel Background ── */}
                <div className="absolute inset-0">
                    {HERO_IMAGES.map((img, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
                            style={{ opacity: currentSlide === i ? 1 : 0 }}
                        >
                            <img
                                src={img.url}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                                loading={i === 0 ? "eager" : "lazy"}
                            />
                        </div>
                    ))}
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#000d2b]/80 via-[#001f6d]/65 to-[#003db8]/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                </div>

                {/* ── Carousel navigation arrows ── */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* ── Carousel dots indicator ── */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {HERO_IMAGES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-2 rounded-full transition-all duration-500 ${currentSlide === i
                                ? "w-8 bg-white"
                                : "w-2 bg-white/40 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                {/* ── Content ── */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        {/* Left — Text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-xl px-5 py-2.5 rounded-full mb-8 border border-white/[0.12]">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-white/80 font-medium text-sm tracking-wide">
                                    India's Most Trusted Platform
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                                Your Journey
                                <br />
                                <span className="hero-gradient-text">Starts Here</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed mb-10 drop-shadow-md">
                                Compare <span className="text-white font-semibold">50+ airlines</span>, find the best deals, and book your perfect flight — all in seconds.
                            </p>
                        </div>

                        {/* Right — Search Card (Glassmorphism) */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 rounded-[2rem] blur-2xl" />

                            <div className="relative bg-white/[0.07] backdrop-blur-2xl rounded-2xl border border-white/[0.12] p-7 md:p-8 shadow-2xl shadow-black/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                        <Search className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg">Search Flights</h2>
                                        <p className="text-white/40 text-xs">Find the best deals instantly</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSearch}>
                                    <div className="space-y-4 mb-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <AirportCombobox
                                                label="From"
                                                value={searchData.from}
                                                onChange={(city) => setSearchData({ ...searchData, from: city })}
                                                placeholder="Departure city..."
                                                variant="glass"
                                            />
                                            <AirportCombobox
                                                label="To"
                                                value={searchData.to}
                                                onChange={(city) => setSearchData({ ...searchData, to: city })}
                                                placeholder="Arrival city..."
                                                variant="glass"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <DatePickerPopover
                                                label="Departure"
                                                value={searchData.departDate}
                                                onChange={(date) => setSearchData({ ...searchData, departDate: date })}
                                                variant="glass"
                                            />
                                            <PassengerSelector
                                                label="Passengers"
                                                value={searchData.passengers}
                                                onChange={(count) => setSearchData({ ...searchData, passengers: count })}
                                                variant="glass"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-base group hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span>Search Flights</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ FEATURES SECTION ═══════════════ */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-[#0033A0]/5 text-[#0033A0] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <Star className="w-4 h-4" />
                            Why Choose SkyBook
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Travel with <span className="text-[#0033A0]">Confidence</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            We make booking flights simple, secure, and affordable
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className="group relative bg-white rounded-2xl p-7 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Hero Animations */}
            <style>{`
                .hero-gradient-text {
                    background: linear-gradient(135deg, #67e8f9, #a5b4fc, #c084fc, #67e8f9);
                    background-size: 300% 300%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradientShift 6s ease-in-out infinite;
                }
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </div>
    );
}
