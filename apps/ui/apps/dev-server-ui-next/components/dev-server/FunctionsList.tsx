"use client";

import { Card } from "@inngest/components";
import { Badge } from "@inngest/components";

interface Function {
  id: string;
  name: string;
  slug: string;
  status: "active" | "paused" | "error";
  runs: number;
}

const MOCK_FUNCTIONS: Function[] = [
  {
    id: "1",
    name: "Send Email",
    slug: "send-email",
    status: "active",
    runs: 124,
  },
  {
    id: "2",
    name: "Process Payment",
    slug: "process-payment",
    status: "active",
    runs: 89,
  },
  {
    id: "3",
    name: "Generate Report",
    slug: "generate-report",
    status: "paused",
    runs: 42,
  },
];

export function FunctionsList() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Registered Functions</h2>
        <p className="text-sm text-foreground/60">
          {MOCK_FUNCTIONS.length} functions registered in your dev environment
        </p>
      </div>

      <div className="grid gap-4">
        {MOCK_FUNCTIONS.map((fn) => (
          <Card key={fn.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{fn.name}</h3>
                <p className="text-sm text-foreground/60">
                  Slug: <code className="bg-secondary px-2 py-1 rounded">{fn.slug}</code>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{fn.runs}</p>
                  <p className="text-xs text-foreground/60">total runs</p>
                </div>
                <Badge
                  variant={fn.status === "active" ? "success" : fn.status === "paused" ? "warning" : "destructive"}
                  label={fn.status}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
