"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Inbox,
  Send,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Languages,
  Paperclip,
  Search,
  Plus,
} from "lucide-react";

export function MailSystem() {
  const [selectedMail, setSelectedMail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);

  const emails = [
    {
      id: 1,
      from: "client@company.com",
      fromName: "John Smith",
      subject: "Project Update Request",
      preview:
        "Could you please provide an update on the current project status...",
      time: "10:30 AM",
      isRead: false,
      isStarred: true,
      hasAttachment: true,
      originalLang: "en",
      translatedSubject: "프로젝트 업데이트 요청",
      translatedPreview:
        "현재 프로젝트 상태에 대한 업데이트를 제공해 주실 수 있나요...",
    },
    {
      id: 2,
      from: "team@design.com",
      fromName: "Design Team",
      subject: "New Design Assets Available",
      preview:
        "We have uploaded the latest design assets to the shared folder...",
      time: "9:15 AM",
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      originalLang: "en",
      translatedSubject: "새로운 디자인 에셋 사용 가능",
      translatedPreview: "공유 폴더에 최신 디자인 에셋을 업로드했습니다...",
    },
    {
      id: 3,
      from: "support@vendor.jp",
      fromName: "サポートチーム",
      subject: "システムメンテナンスのお知らせ",
      preview: "来週の火曜日にシステムメンテナンスを実施いたします...",
      time: "8:45 AM",
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      originalLang: "ja",
      translatedSubject: "시스템 유지보수 안내",
      translatedPreview: "다음 주 화요일에 시스템 유지보수를 실시합니다...",
    },
  ];

  return (
    <div className="flex h-full">
      {/* 메일 목록 사이드바 */}
      <div className="flex w-80 flex-col border-r border-blue-200 bg-blue-50">
        <div className="border-b border-blue-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-blue-900">웹메일</h2>
            <Button
              size="sm"
              onClick={() => setIsComposing(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-1 h-4 w-4" />
              작성
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input placeholder="메일 검색..." className="pl-9" />
          </div>
        </div>

        <Tabs defaultValue="inbox" className="flex flex-1 flex-col">
          <TabsList className="mx-4 mt-2 grid w-full grid-cols-4">
            <TabsTrigger value="inbox">받은편지함</TabsTrigger>
            <TabsTrigger value="sent">보낸편지함</TabsTrigger>
            <TabsTrigger value="starred">중요</TabsTrigger>
            <TabsTrigger value="archive">보관함</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="flex-1 overflow-hidden">
            <div className="space-y-2 p-4">
              {emails.map((email) => (
                <Card
                  key={email.id}
                  className={`cursor-pointer transition-colors hover:bg-blue-100 ${
                    !email.isRead ? "border-blue-200 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedMail(email)}
                >
                  <CardContent className="p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{email.fromName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm ${!email.isRead ? "font-semibold" : ""}`}
                          >
                            {email.fromName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {email.from}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {email.isStarred && (
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                        )}
                        {email.hasAttachment && (
                          <Paperclip className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-xs text-gray-500">
                          {email.time}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p
                        className={`truncate text-sm ${!email.isRead ? "font-semibold" : ""}`}
                      >
                        {email.translatedSubject}
                      </p>
                      <p className="truncate text-xs text-gray-600">
                        {email.translatedPreview}
                      </p>
                    </div>

                    {email.originalLang !== "ko" && (
                      <div className="mt-2 flex items-center space-x-1">
                        <Languages className="h-3 w-3 text-blue-500" />
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-xs text-blue-800"
                        >
                          {email.originalLang.toUpperCase()} → KO
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 메일 내용 영역 */}
      <div className="flex flex-1 flex-col">
        {isComposing ? (
          <div className="flex-1 p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>새 메일 작성</CardTitle>
                  <Button variant="ghost" onClick={() => setIsComposing(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="받는 사람" />
                  <Input placeholder="참조" />
                </div>
                <Input placeholder="제목" />
                <Textarea placeholder="메일 내용을 입력하세요..." rows={12} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="mr-1 h-4 w-4" />
                      첨부
                    </Button>
                    <Button variant="outline" size="sm">
                      <Languages className="mr-1 h-4 w-4" />
                      번역
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsComposing(false)}
                    >
                      취소
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Send className="mr-1 h-4 w-4" />
                      전송
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedMail ? (
          <div className="flex flex-1 flex-col">
            {/* 메일 헤더 */}
            <div className="border-b border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {selectedMail.translatedSubject}
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Reply className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Forward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{selectedMail.fromName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedMail.fromName}</p>
                    <p className="text-sm text-gray-500">{selectedMail.from}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{selectedMail.time}</p>
                  {selectedMail.originalLang !== "ko" && (
                    <Badge variant="secondary" className="mt-1">
                      <Languages className="mr-1 h-3 w-3" />
                      자동 번역됨
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* 메일 내용 */}
            <div className="flex-1 overflow-auto p-6">
              <div className="prose max-w-none">
                <p>안녕하세요,</p>
                <p>
                  현재 진행 중인 프로젝트의 상태에 대한 업데이트를 요청드립니다.
                  특히 다음 사항들에 대해 알고 싶습니다:
                </p>
                <ul>
                  <li>현재 진행률</li>
                  <li>예상 완료 일정</li>
                  <li>발생한 이슈나 지연 사항</li>
                  <li>추가 리소스 필요 여부</li>
                </ul>
                <p>가능하시면 이번 주 내로 답변 부탁드립니다.</p>
                <p>감사합니다.</p>
                <p>John Smith</p>
              </div>

              {selectedMail.originalLang !== "ko" && (
                <Card className="mt-6 bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      원문 ({selectedMail.originalLang.toUpperCase()})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Could you please provide an update on the current project
                      status? I would like to know about the current progress,
                      expected completion date, any issues or delays, and if
                      additional resources are needed.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <Inbox className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">메일을 선택하여 내용을 확인하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
