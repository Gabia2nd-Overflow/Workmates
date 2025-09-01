"use client";

import { useState } from "react";
import { Search, Brain } from "lucide-react";

export function AICopilot() {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: "user",
      message: "프로젝트 문서에서 마케팅 전략 관련 내용을 찾아줘",
      timestamp: "14:30",
    },
    {
      id: 2,
      type: "ai",
      message:
        "LlamaIndex를 통해 검색한 결과, 다음 문서들에서 마케팅 전략 관련 내용을 찾았습니다:",
      timestamp: "14:31",
      sources: [
        { name: "marketing-strategy-2024.pdf", relevance: 95 },
        { name: "business-plan.docx", relevance: 87 },
        { name: "campaign-analysis.xlsx", relevance: 78 },
      ],
    },
  ]);

  const recentFiles = [
    {
      name: "project-brief.pdf",
      size: "2.3MB",
      uploaded: "2시간 전",
      indexed: true,
    },
    {
      name: "design-specs.figma",
      size: "15.7MB",
      uploaded: "4시간 전",
      indexed: true,
    },
    {
      name: "meeting-notes.docx",
      size: "1.1MB",
      uploaded: "1일 전",
      indexed: true,
    },
    {
      name: "budget-analysis.xlsx",
      size: "3.8MB",
      uploaded: "2일 전",
      indexed: false,
    },
  ];

  const quickActions = [
    {
      icon: Search,
      label: "문서 검색",
      description: "업로드된 파일에서 정보 검색",
    },
  ];
}
