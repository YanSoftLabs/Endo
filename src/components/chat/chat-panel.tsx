"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/lib/schemas/site-config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Rename to Shyam & Co",
  "Make it more professional",
  "Change primary color to navy",
  "Make the hero headline more urgent",
];

export function ChatPanel({
  projectId,
  onConfigUpdate,
}: {
  projectId: string;
  onConfigUpdate: (config: SiteConfig) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I can edit your site instantly. Rename the business, change colors, update headlines, or refine the professional tone — try a quick action below or describe your change.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, message: userMsg }),
      });

      const raw = await res.text();
      if (!raw) throw new Error("Empty response from server");

      let data: { message?: string; error?: string; siteConfig?: SiteConfig };
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(data.error || "Chat failed");

      setMessages((m) => [...m, { role: "assistant", content: data.message || "Done." }]);

      if (data.siteConfig) {
        onConfigUpdate(data.siteConfig);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-r bg-gray-50">
      <div className="p-4 border-b bg-white">
        <div className="font-semibold text-sm">Chat Editor</div>
        <p className="text-xs text-gray-500 mt-1">Changes apply live in the preview</p>
      </div>

      <div className="px-3 py-2 border-b bg-white flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => send(prompt)}
            className="text-xs px-2.5 py-1 rounded-full border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm p-3 rounded-xl max-w-[95%] whitespace-pre-wrap ${
              m.role === "user" ? "bg-violet-600 text-white ml-auto" : "bg-white border shadow-sm"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="text-xs text-violet-600 animate-pulse px-3">Applying changes...</div>
        )}
      </div>

      <div className="p-4 border-t space-y-2 bg-white">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "Change name from Ram & Co to Shyam & Co"'
          rows={3}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <Button onClick={() => send()} disabled={loading || !input.trim()} className="w-full">
          {loading ? "Applying..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
