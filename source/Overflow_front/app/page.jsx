"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { ChatSystem } from "@/components/chat-system"
import { BoardSystem } from "@/components/board-system"
import { MailSystem } from "@/components/mail-system"
import { ImageGenerator } from "@/components/image-generator"
import { AICopilot } from "@/components/ai-copilot"
import { ScheduleManager } from "@/components/schedule-manager"
import { CrawlingTool } from "@/components/crawling-tool"
import { SettingsPage } from "@/components/settings-page"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "chat":
        return <ChatSystem />
      case "board":
        return <BoardSystem />
      case "mail":
        return <MailSystem />
      case "image-gen":
        return <ImageGenerator />
      case "ai-copilot":
        return <AICopilot />
      case "schedule":
        return <ScheduleManager />
      case "crawling":
        return <CrawlingTool />
      case "settings":
        return <SettingsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden">{renderContent()}</main>
    </div>
  )
}
