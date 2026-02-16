"use client";

import { useState } from "react";
import { Card } from "@inngest/components";
import { Header } from "./Header";
import { FunctionsList } from "./FunctionsList";
import { EventsMonitor } from "./EventsMonitor";

export function DevServerDashboard() {
  const [activeTab, setActiveTab] = useState<"functions" | "events">("functions");

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="border-b border-border">
            <div className="flex gap-4 px-6 py-4">
              <button
                onClick={() => setActiveTab("functions")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "functions"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                Functions
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "events"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                Events
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {activeTab === "functions" && <FunctionsList />}
            {activeTab === "events" && <EventsMonitor />}
          </div>
        </div>
      </div>
    </div>
  );
}
