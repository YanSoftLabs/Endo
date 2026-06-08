"use client";

interface AnalysisBannerProps {
  summary?: string;
  insights?: string;
  aiGenerated?: boolean;
}

export function AnalysisBanner({ summary, insights, aiGenerated }: AnalysisBannerProps) {
  if (!summary && !insights) return null;

  return (
    <div className="mx-4 mt-3 rounded-xl border border-violet-200 bg-violet-50/80 p-4 shrink-0">
      <div className="flex items-start gap-2">
        <span className="text-violet-600 text-lg leading-none mt-0.5">✦</span>
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-violet-800 uppercase tracking-wide">
            {aiGenerated ? "AI analysis & strategy" : "Site strategy"}
          </p>
          {summary && <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>}
          {insights && summary !== insights && (
            <p className="text-xs text-gray-600 leading-relaxed">{insights}</p>
          )}
        </div>
      </div>
    </div>
  );
}
