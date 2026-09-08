import React from 'react';
import { Info } from 'lucide-react';

interface ParameterSliderProps {
  id: string;
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  description: string;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({
  id,
  label,
  symbol,
  value,
  min,
  max,
  step,
  unit = '',
  description,
  onChange,
  disabled = false,
}) => {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="p-4 rounded-2xl glass-medium border border-white/80 space-y-2.5 hover:border-amber-400/60 hover:shadow-md transition-all duration-300 glass-specular shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-xs font-semibold text-stone-800 cursor-pointer">
            {label}
          </label>
          {symbol && (
            <span className="text-[11px] font-mono font-semibold text-amber-900 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-300/60 backdrop-blur-xs">
              {symbol}
            </span>
          )}
          <div className="relative group/tip cursor-help">
            <Info className="w-3.5 h-3.5 text-stone-400 hover:text-stone-600 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tip:block w-56 p-2.5 bg-stone-900/90 backdrop-blur-md text-stone-100 text-[11px] rounded-xl shadow-xl z-30 pointer-events-none leading-snug border border-white/20">
              {description}
            </div>
          </div>
        </div>

        <div className="text-xs font-mono font-bold text-stone-900 bg-white/85 px-2.5 py-1 rounded-xl border border-white/90 shadow-2xs backdrop-blur-md">
          {value}
          {unit}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="relative flex items-center">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-stone-200/70 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 border border-white/60 shadow-inner"
            style={{
              background: `linear-gradient(to right, #D97706 0%, #EA580C ${percent}%, rgba(214, 211, 209, 0.6) ${percent}%, rgba(214, 211, 209, 0.6) 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-stone-500 font-medium">
          <span className="font-mono">{min}{unit}</span>
          <span className="text-stone-400 text-[10.5px] truncate max-w-[200px]">{description}</span>
          <span className="font-mono">{max}{unit}</span>
        </div>
      </div>
    </div>
  );
};
