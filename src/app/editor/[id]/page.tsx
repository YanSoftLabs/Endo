"use client";

import { use, useCallback, useEffect, useState } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { PreviewPanel } from "@/components/preview/preview-panel";
import { AnalysisBanner } from "@/components/preview/analysis-banner";
import type { SiteConfig } from "@/lib/schemas/site-config";
import Link from "next/link";

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [refreshKey, setRefreshKey] = useState(0);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.siteConfig) setSiteConfig(d.siteConfig);
      })
      .catch(console.error);
  }, [id]);

  const handleConfigUpdate = useCallback((config: SiteConfig) => {
    setSiteConfig(config);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
        <Link href="/" className="font-bold text-violet-600">
          Vibe Coding
        </Link>
        <div className="flex items-center gap-3">
          {siteConfig && (
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{siteConfig.businessName}</span>
          )}
          <Link href={`/preview/${id}`} target="_blank" className="text-sm text-violet-600 hover:underline">
            Open full preview
          </Link>
        </div>
      </header>

      <AnalysisBanner
        summary={siteConfig?.analysisSummary}
        insights={siteConfig?.industryInsights}
        aiGenerated={siteConfig?.aiGenerated}
      />

      <div className="flex flex-1 min-h-0">
        <div className="w-80 xl:w-96 shrink-0">
          <ChatPanel projectId={id} onConfigUpdate={handleConfigUpdate} />
        </div>
        <div className="flex-1 min-w-0">
          <PreviewPanel projectId={id} configOverride={siteConfig} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
