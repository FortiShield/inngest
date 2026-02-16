"use client";

import { Card, Badge } from "@inngest/components";

interface Event {
  id: string;
  name: string;
  timestamp: string;
  status: "pending" | "processed" | "failed";
}

const MOCK_EVENTS: Event[] = [
  {
    id: "evt-1",
    name: "user.signup",
    timestamp: "2024-02-16T10:30:00Z",
    status: "processed",
  },
  {
    id: "evt-2",
    name: "order.created",
    timestamp: "2024-02-16T10:29:45Z",
    status: "processed",
  },
  {
    id: "evt-3",
    name: "payment.failed",
    timestamp: "2024-02-16T10:29:30Z",
    status: "pending",
  },
  {
    id: "evt-4",
    name: "email.sent",
    timestamp: "2024-02-16T10:29:15Z",
    status: "processed",
  },
];

export function EventsMonitor() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Recent Events</h2>
        <p className="text-sm text-foreground/60">
          Monitor events flowing through your dev environment
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Event Name</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Timestamp</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EVENTS.map((event) => (
              <tr key={event.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="py-3 px-4 text-foreground">{event.name}</td>
                <td className="py-3 px-4 text-foreground/60 text-sm">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={event.status === "processed" ? "success" : event.status === "pending" ? "warning" : "destructive"}
                    label={event.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
