import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover.jsx';
import { Calendar } from './ui/calendar.jsx';

export function DatePickerPopover({
    value, // ISO string "YYYY-MM-DD" or ""
    onChange, // receives ISO string
    label = 'Departure',
    variant = 'default', // 'default' | 'glass'
}) {
    const [open, setOpen] = useState(false);

    const selectedDate = value ? new Date(value + 'T00:00:00') : undefined;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleSelect = (date) => {
        if (date) {
            // Format to ISO YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
        } else {
            onChange('');
        }
        setOpen(false);
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
                            <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            {selectedDate ? (
                                <div>
                                    <div className={`font-bold text-sm leading-tight ${isGlass ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        {format(selectedDate, 'dd MMM yyyy')}
                                    </div>
                                    <div className={`text-xs mt-0.5 ${isGlass ? 'text-white/40' : 'text-gray-500'
                                        }`}>
                                        {format(selectedDate, 'EEEE')}
                                    </div>
                                </div>
                            ) : (
                                <span className={`text-sm ${isGlass ? 'text-white/40' : 'text-gray-400'
                                    }`}>
                                    Select Date
                                </span>
                            )}
                        </div>
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 rounded-2xl border-gray-200 shadow-2xl"
                    align="start"
                    sideOffset={6}
                >
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        disabled={(date) => date < today}
                        initialFocus
                        className="rounded-2xl"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
