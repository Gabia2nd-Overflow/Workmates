"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Mail,
  ImageIcon,
  Bot,
  Calendar,
  Search,
  Settings,
  Bell,
} from "lucide-react"

export function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: "dashboard", label: "대시보드", icon: LayoutDashboard },
    { id: "chat", label: "메신저", icon: MessageSquare, badge: 5 },
    { id: "board", label: "하이워크 게시판", icon: FileText, badge: 2 },
    { id: "mail", label: "웹메일", icon: Mail, badge: 12 },
    { id: "image-gen", label: "이미지 생성", icon: ImageIcon },
    { id: "ai-copilot", label: "AI 코파일럿", icon: Bot },
    { id: "schedule", label: "스케줄 관리", icon: Calendar, badge: 3 },
    { id: "crawling", label: "크롤링 도구", icon: Search },
    { id: "settings", label: "설정", icon: Settings },
  ]

  return (
    <div className="w-64 bg-blue-50 border-r border-blue-200 flex flex-col">
      <div className="p-6 border-b border-blue-200">
        <h1 className="text-xl font-bold text-blue-900">CollabHub</h1>
        <p className="text-sm text-blue-600 mt-1">올인원 협업 메신저</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id ? "bg-blue-600 text-white hover:bg-blue-700" : "text-blue-700 hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 bg-blue-200 text-blue-800">
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-blue-200">
        <Button variant="outline" className="w-full bg-transparent border-blue-300 text-blue-700 hover:bg-blue-100">
          <Bell className="mr-2 h-4 w-4" />
          알림 설정
        </Button>
      </div>
    </div>
  )
}
