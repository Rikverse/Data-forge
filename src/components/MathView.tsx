import React, { useState } from 'react';
import katex from 'katex';
import { HelpCircle, X, ChevronRight, Sparkles } from 'lucide-react';

interface MathViewProps {
  formula: string;
  displayMode?: boolean;
  explanationTitle?: string;
  explanationBody?: string;
  terms?: { symbol: string; meaning: string }[];
  interactiveNote?: string;
}

export const MathView: React.FC<MathViewProps> = ({
  formula,
  displayMode = true,
  explanationTitle = 'Mathematical Breakdown',
  explanationBody,
  terms,
  interactiveNote,
}) => {
  const [showModal, setShowModal] = useState(false);

  // Render KaTeX HTML safely
  const renderedHtml = React.useMemo(() => {
    try {
      return katex.renderToString(formula, {
        displayMode,
        throwOnError: false,
      });
    } catch {
      return formula;
    }
  }, [formula, displayMode]);

  return (
    <div className={`relative group ${displayMode ? 'my-3 p-4 bg-white border border-stone-200 rounded-2xl shadow-2xs' : 'inline-block'}`}>
      <div className="flex items-center justify-between gap-3 overflow-x-auto">
        <div
          className={displayMode ? 'math-display text-stone-900 font-serif text-lg tracking-wide py-1' : 'math-inline text-amber-900 font-serif font-medium'}
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />

        {(explanationBody || terms) && (
          <button
            id="explain-formula-btn"
            type="button"
            onClick={() => setShowModal(true)}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Explain this formula in plain language"
            aria-label="Explain this formula"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Explain</span>
          </button>
        )}
      </div>

      {/* Interactive Explanation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-stone-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-left">
            <div className="flex items-start justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 rounded-2xl border border-amber-200 text-amber-800">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-display">{explanationTitle}</h3>
                  <p className="text-xs text-stone-500">Plain-language intuition & variable meanings</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formula display */}
            <div className="my-4 p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 overflow-x-auto text-center">
              <div
                className="math-display text-stone-900 text-lg"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>

            {explanationBody && (
              <div className="mb-4 text-sm text-stone-700 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200">
                <p>{explanationBody}</p>
              </div>
            )}

            {terms && terms.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider">Meaning of Terms</h4>
                <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
                  {terms.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-[#FAF8F5] rounded-xl text-xs border border-stone-200">
                      <span className="font-mono font-bold text-amber-900 min-w-[32px] pt-0.5">{t.symbol}</span>
                      <span className="text-stone-700 flex-1">{t.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {interactiveNote && (
              <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <ChevronRight className="w-4 h-4 flex-shrink-0 text-amber-700" />
                <span className="font-medium">{interactiveNote}</span>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
