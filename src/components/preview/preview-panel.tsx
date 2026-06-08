"use client";

import { useEffect, useState } from "react";
import { SiteRenderer } from "@/lib/site-templates/site-renderer";
import type { SiteConfig } from "@/lib/schemas/site-config";
import { Button } from "@/components/ui/button";

export function PreviewPanel({
  projectId,
  configOverride,
  refreshKey,
}: {
  projectId: string;
  configOverride?: SiteConfig | null;
  refreshKey: number;
}) {
  const [config, setConfig] = useState<SiteConfig | null>(configOverride ?? null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    if (configOverride) {
      setConfig(configOverride);
      return;
    }
    fetch(`/api/projects/${projectId}`)
      .then((r) => r.json())
      .then((d) => setConfig(d.siteConfig))
      .catch(console.error);
  }, [projectId, refreshKey, configOverride]);

  const widths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  if (!config) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading preview...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 p-3 border-b bg-white">
        <div className="flex items-center gap-2">
          {(["desktop", "tablet", "mobile"] as const).map((v) => (
            <Button key={v} size="sm" variant={viewport === v ? "default" : "outline"} onClick={() => setViewport(v)}>
              {v}
            </Button>
          ))}
        </div>
        <span className="text-xs text-gray-400 hidden sm:inline">{config.businessName}</span>
      </div>
      <div className="flex-1 overflow-auto bg-slate-200 p-4">
        <div
          key={`${config.businessName}-${refreshKey}`}
          className="mx-auto bg-white shadow-xl transition-all duration-300 overflow-hidden rounded-lg"
          style={{ width: widths[viewport], maxWidth: "100%" }}
        >
          <SiteRenderer config={config} />
        </div>
      </div>
    </div>
  );
}
