import { useState } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.jsx';

export function PassengerSelector({
    value = 1,
    onChange,
    label = 'Passengers',
    variant = 'default', // 'default' | 'glass'
}) {
    const [open, setOpen] = useState(false);

    const min = 1;
    const max = 9;

    const decrement = () => {
        if (value > min) onChange(value - 1);
    };

    const increment = () => {
        if (value < max) onChange(value + 1);
    };

    const isGlass = variant === 'glass';

    return (
        <div>
            <label className={`block text-sm font-semibold mb-2 ${isGlass ? 'text-white/70' : 'text-gray-700'
                }`}>
                {label}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group ${isGlass
                            ? `bg-white/[0.08] border-white/[0.12] hover:bg-white/[0.14] ${open ? 'ring-2 ring-cyan-400/40 border-cyan-400/30' : ''
                            }`
                            : `bg-white border-gray-200 hover:border-indigo-400 shadow-sm ${open ? 'ring-2 ring-indigo-500/20 border-indigo-500' : ''
                            }`
                            }`}
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isGlass
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                            }`}>
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`font-bold text-sm leading-tight ${isGlass ? 'text-white' : 'text-gray-900'
                                }`}>
                                {value} {value === 1 ? 'Passenger' : 'Passengers'}
                            </div>
                            <div className={`text-xs mt-0.5 ${isGlass ? 'text-white/40' : 'text-gray-500'
                                }`}>
                                Economy class
                            </div>
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-5 rounded-2xl border-gray-200 shadow-2xl"
                    align="start"
                    sideOffset={6}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-sm text-gray-900">Travellers</div>
                            <div className="text-xs text-gray-500 mt-0.5">Economy class</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={decrement}
                                disabled={value <= min}
                                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:cursor-not-allowed"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xl font-bold text-gray-900 w-8 text-center tabular-nums">
                                {value}
                            </span>
                            <button
                                type="button"
                                onClick={increment}
                                disabled={value >= max}
                                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-[0.98]"
                    >
                        Done
                    </button>
                </PopoverContent>
            </Popover>
        </div>
    );
}
