import React, { useState } from 'react';
import {
  FileText,
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Brain,
  HelpCircle,
  Activity,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { AppRoute, UserProgress, NotebookCell } from '../types';
import { NOTEBOOK_CELLS } from '../data/curriculumData';

interface NotebookViewProps {
  onNavigate: (route: AppRoute) => void;
  progress: UserProgress;
  onExecuteCell: (cellId: string) => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  onNavigate,
  progress,
  onExecuteCell,
}) => {
  const [cells, setCells] = useState<NotebookCell[]>(NOTEBOOK_CELLS);
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  const handleSelectPrediction = (cellId: string, option: string) => {
    setPredictions((prev) => ({ ...prev, [cellId]: option }));
  };

  const handleRunCell = (cellId: string) => {
    setCells((prev) =>
      prev.map((c) => (c.id === cellId ? { ...c, isExecuted: true } : c))
    );
    onExecuteCell(cellId);
  };

  const handleCopyCode = (cellId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCellId(cellId);
    setTimeout(() => setCopiedCellId(null), 2000);
  };

  const handleRestartKernel = () => {
    setCells(
      NOTEBOOK_CELLS.map((c) => ({
        ...c,
        isExecuted: c.type === 'markdown',
      }))
    );
    setPredictions({});
  };

  const executedCodeCellsCount = cells.filter((c) => c.type === 'code' && c.isExecuted).length;
  const totalCodeCellsCount = cells.filter((c) => c.type === 'code').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-9">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/60 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-950 border border-amber-300/60 backdrop-blur-md shadow-2xs">
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>Interactive PyTorch Workbook</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            BDH-CQ Implementation Lab
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-normal">
            Step through real executable PyTorch tensors for threshold projections, Hebbian plasticity, and recurrent latent deliberation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestartKernel}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-medium hover:bg-white text-stone-700 border border-white/90 text-xs font-medium cursor-pointer shadow-2xs hover:shadow-xs transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>Restart Kernel</span>
          </button>
          <span className="text-xs font-bold font-mono text-amber-950 bg-amber-500/15 px-3.5 py-1.5 rounded-2xl border border-amber-300/60 backdrop-blur-xs">
            {executedCodeCellsCount} / {totalCodeCellsCount} Executed
          </span>
        </div>
      </div>

      {/* Notebook Cells Container */}
      <div className="space-y-8">
        {cells.map((cell, idx) => {
          if (cell.type === 'markdown') {
            return (
              <div
                key={cell.id}
                className="p-6 sm:p-7 rounded-3xl glass-strong border border-white/90 text-stone-700 text-xs sm:text-sm leading-relaxed space-y-2 shadow-xl glass-specular font-normal"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: cell.content
                      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-stone-900 mb-2 font-display">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-950 font-bold">$1</strong>')
                      .replace(/\n/g, '<br/>'),
                  }}
                />
              </div>
            );
          }

          // Code Cell
          const userPred = predictions[cell.id];

          return (
            <div
              key={cell.id}
              className="rounded-3xl border border-white/90 glass-strong overflow-hidden shadow-xl glass-specular space-y-0"
            >
              {/* Cell Header Bar */}
              <div className="px-5 py-3 glass-medium border-b border-stone-200/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-amber-950 font-bold">
                    In [{cell.isExecuted ? idx : ' '}] :
                  </span>
                  <span className="text-stone-800 font-semibold font-display">{cell.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(cell.id, cell.content)}
                    className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg cursor-pointer transition-colors"
                    title="Copy code snippet"
                  >
                    {copiedCellId === cell.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunCell(cell.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      cell.isExecuted
                        ? 'glass-light hover:bg-white text-stone-700 border border-white/90 shadow-2xs'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-xs border border-amber-400/40 active:scale-[0.98]'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>{cell.isExecuted ? 'Re-run' : 'Run Cell'}</span>
                  </button>
                </div>
              </div>

              {/* Prediction Prompt Before Run */}
              {cell.predictionPrompt && !cell.isExecuted && (
                <div className="p-4 bg-amber-500/10 border-b border-amber-300/50 text-xs space-y-2 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>{cell.predictionPrompt}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {cell.predictionOptions?.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectPrediction(cell.id, opt)}
                        className={`p-2.5 rounded-xl text-left text-[11px] border transition-all cursor-pointer ${
                          userPred === opt
                            ? 'bg-amber-500/20 border-amber-400 text-amber-950 font-semibold shadow-xs'
                            : 'glass-light border-white/80 text-stone-600 hover:bg-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Python Code Block */}
              <div className="p-5 bg-[#181715]/95 backdrop-blur-md overflow-x-auto text-xs font-mono text-[#F4EFE6] leading-relaxed border-y border-stone-800/40">
                <pre>{cell.content}</pre>
              </div>

              {/* Execution Output (Visible after run) */}
              {cell.isExecuted && cell.output && (
                <div className="border-t border-stone-200/50 glass-light p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 font-bold">
                    <Terminal className="w-3.5 h-3.5 text-amber-600" />
                    <span>Output [{idx}] :</span>
                  </div>

                  <div className="p-3.5 glass-medium rounded-2xl border border-white/90 text-xs font-mono text-stone-800 leading-relaxed whitespace-pre-wrap shadow-2xs">
                    {cell.output}
                  </div>

                  {/* Post-execution Reflection */}
                  {cell.reflectionQuestion && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/50 space-y-1 text-xs backdrop-blur-xs">
                      <div className="font-bold text-amber-950 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-amber-600" />
                        <span>Insight: {cell.reflectionQuestion}</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed font-normal">
                        {cell.reflectionNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Next Step Banner */}
      <div className="p-7 rounded-3xl glass-strong border border-white/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl glass-specular">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-stone-900 font-display">Review the Research Foundations</h3>
          <p className="text-xs text-stone-600 font-normal">
            Examine the original published papers and citations from Pathway, Chollet, and Hopfield.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/papers')}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-2 flex-shrink-0 shadow-md hover:shadow-lg hover:shadow-amber-500/20 active:scale-[0.98] border border-amber-400/40"
        >
          <span>Explore Research Papers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
