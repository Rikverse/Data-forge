import React from 'react';

/**
 * Reusable Glass Tokens and Styles
 */
export type GlassStrength = 'light' | 'medium' | 'strong' | 'solid-accent';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  strength?: GlassStrength;
  interactive?: boolean;
  specular?: boolean;
  reflection?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  strength = 'medium',
  interactive = false,
  specular = true,
  reflection = false,
  className = '',
  children,
  ...props
}) => {
  const strengthClass =
    strength === 'light'
      ? 'glass-light'
      : strength === 'strong'
      ? 'glass-strong'
      : strength === 'solid-accent'
      ? 'bg-white/95 border border-white/80 shadow-md backdrop-blur-md'
      : 'glass-medium';

  const interactiveClass = interactive ? 'glass-interactive cursor-pointer' : '';
  const specularClass = specular ? 'glass-specular' : '';
  const reflectionClass = reflection ? 'glass-reflection' : '';

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${strengthClass} ${specularClass} ${reflectionClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  specular?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  className = '',
  children,
  specular = true,
  ...props
}) => {
  return (
    <div
      className={`glass-strong rounded-3xl p-6 sm:p-8 ${specular ? 'glass-specular' : ''} shadow-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'glass',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs rounded-xl gap-1.5'
      : size === 'lg'
      ? 'px-6 py-3 text-base rounded-2xl gap-2.5'
      : 'px-4 py-2 text-sm rounded-xl gap-2';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses =
        'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:shadow-amber-500/20 border border-amber-400/40 active:scale-[0.98] transition-all duration-200';
      break;
    case 'secondary':
      variantClasses =
        'bg-white/80 hover:bg-white text-stone-900 font-semibold border border-stone-200/90 hover:border-amber-400/60 shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-200';
      break;
    case 'ghost':
      variantClasses =
        'bg-transparent hover:bg-stone-200/50 text-stone-700 hover:text-stone-900 transition-colors';
      break;
    case 'glass':
    default:
      variantClasses =
        'glass-medium hover:bg-white/90 text-stone-900 font-medium border border-white/90 shadow-2xs hover:shadow-sm active:scale-[0.98] transition-all duration-200';
      break;
  }

  return (
    <button
      className={`inline-flex items-center justify-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const GlassInput: React.FC<GlassInputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`glass-light px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 rounded-xl border border-white/80 focus:border-amber-500 focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs transition-all ${className}`}
      {...props}
    />
  );
};

interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'blue' | 'stone';
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  variant = 'amber',
  className = '',
}) => {
  const colorMap = {
    amber: 'bg-amber-100/70 text-amber-900 border-amber-300/60',
    emerald: 'bg-emerald-100/70 text-emerald-900 border-emerald-300/60',
    blue: 'bg-sky-100/70 text-sky-900 border-sky-300/60',
    stone: 'bg-stone-200/60 text-stone-800 border-stone-300/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border shadow-2xs ${colorMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

interface GlassCodePanelProps {
  children: React.ReactNode;
  title?: string;
  badge?: string;
  className?: string;
}

export const GlassCodePanel: React.FC<GlassCodePanelProps> = ({
  children,
  title,
  badge,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-stone-800 shadow-xl overflow-hidden ${className}`}
    >
      {(title || badge) && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950/70 border-b border-stone-800/80">
          {title && <span className="text-xs font-mono text-stone-400">{title}</span>}
          {badge && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-4 overflow-x-auto text-stone-100 font-mono text-xs leading-relaxed">
        {children}
      </div>
    </div>
  );
};
