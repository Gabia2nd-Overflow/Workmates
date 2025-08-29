"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  MessageSquare,
  Heart,
  Eye,
  Clock,
  Zap,
} from "lucide-react";

export function BoardSystem() {
  const [searchQuery, setSearchQuery] = useState("");

  const posts = [
    {
      id: 1,
      title: "새로운 프로젝트 기획안 검토 요청",
      content:
        "클라이언트 요구사항을 반영한 새로운 웹사이트 프로젝트 기획안입니다. 팀원들의 의견을 듣고 싶습니다.",
      author: "김철수",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "2시간 전",
      category: "기획",
      sentiment: "positive",
      views: 45,
      comments: 8,
      likes: 12,
      aiSummary:
        "긍정적인 반응이 많은 기획안으로, 실현 가능성이 높다고 분석됩니다.",
    },
    {
      id: 2,
      title: "디자인 시스템 업데이트 관련 논의",
      content:
        "현재 사용 중인 디자인 시스템의 문제점과 개선 방안에 대해 논의하고 싶습니다.",
      author: "이영희",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "4시간 전",
      category: "디자인",
      sentiment: "neutral",
      views: 32,
      comments: 15,
      likes: 8,
      aiSummary:
        "건설적인 의견들이 많으며, 구체적인 개선 방안이 제시되고 있습니다.",
    },
    {
      id: 3,
      title: "마케팅 캠페인 성과 분석",
      content:
        "지난 달 진행한 마케팅 캠페인의 성과를 분석하고 다음 전략을 수립해보겠습니다.",
      author: "박민수",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "6시간 전",
      category: "마케팅",
      sentiment: "positive",
      views: 67,
      comments: 22,
      likes: 18,
      aiSummary:
        "성과에 대한 긍정적 평가가 주를 이루며, 확장 전략에 대한 관심이 높습니다.",
    },
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-3 w-3" />;
      case "negative":
        return <TrendingUp className="h-3 w-3 rotate-180" />;
      default:
        return <Zap className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">하이워크 게시판</h1>
          <p className="mt-1 text-blue-600">
            AI 감성 분석과 요약이 지원되는 협업 게시판
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />새 게시글
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          필터
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="planning">기획</TabsTrigger>
          <TabsTrigger value="design">디자인</TabsTrigger>
          <TabsTrigger value="development">개발</TabsTrigger>
          <TabsTrigger value="marketing">마케팅</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={post.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {post.author}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                          {post.time}
                        </span>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${getSentimentColor(post.sentiment)} flex items-center space-x-1`}
                  >
                    {getSentimentIcon(post.sentiment)}
                    <span className="capitalize">{post.sentiment}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">{post.content}</p>

                {/* AI 요약 */}
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="mb-2 flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      AI 감성 분석 요약
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">{post.aiSummary}</p>
                </div>

                {/* 상호작용 통계 */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>평균 응답시간: 2시간</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* 실시간 분석 대시보드 */}
      <Card>
        <CardHeader>
          <CardTitle>실시간 게시판 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">78%</div>
              <div className="text-sm text-gray-500">긍정적 반응</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-500">오늘 게시글</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3시간</div>
              <div className="text-sm text-gray-500">평균 응답시간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-gray-500">해결률</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
