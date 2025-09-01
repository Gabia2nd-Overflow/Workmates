"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Hash,
  Plus,
  Search,
} from "lucide-react";

export function ChatSystem() {
  const [selectedChat, setSelectedChat] = useState("general");
  const [message, setMessage] = useState("");

  const spaces = [
    { id: "general", name: "일반", type: "channel", unread: 3 },
    { id: "dev-team", name: "개발팀", type: "channel", unread: 0 },
    { id: "design", name: "디자인", type: "channel", unread: 1 },
    { id: "marketing", name: "마케팅", type: "channel", unread: 5 },
  ];

  const directMessages = [
    { id: "john", name: "김철수", status: "online", unread: 2 },
    { id: "jane", name: "이영희", status: "away", unread: 0 },
    { id: "mike", name: "박민수", status: "offline", unread: 1 },
  ];

  const messages = [
    {
      id: 1,
      user: "김철수",
      avatar: "/placeholder.svg?height=32&width=32",
      message: "새로운 프로젝트 기획서 검토 부탁드립니다.",
      time: "14:30",
      reactions: ["👍", "❤️"],
    },
    {
      id: 2,
      user: "이영희",
      avatar: "/placeholder.svg?height=32&width=32",
      message: "디자인 시안 첨부합니다. 피드백 주세요!",
      time: "14:35",
      hasAttachment: true,
    },
    {
      id: 3,
      user: "박민수",
      avatar: "/placeholder.svg?height=32&width=32",
      message: "내일 미팅 시간 변경 가능한가요?",
      time: "14:40",
      reactions: ["🤔"],
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // 메시지 전송 로직
      setMessage("");
    }
  };

  return (
    <div className="flex h-full">
      {/* 사이드바 - 채널 및 DM 목록 */}
      <div className="flex w-64 flex-col border-r border-blue-200 bg-blue-50">
        <div className="border-b border-blue-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-blue-900">워크스페이스</h2>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-700 hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input placeholder="채널 검색..." className="pl-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {/* 채널 목록 */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">채널</h3>
              <div className="space-y-1">
                {spaces.map((space) => (
                  <Button
                    key={space.id}
                    variant={selectedChat === space.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedChat(space.id)}
                  >
                    <Hash className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{space.name}</span>
                    {space.unread > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {space.unread}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* 다이렉트 메시지 */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                다이렉트 메시지
              </h3>
              <div className="space-y-1">
                {directMessages.map((dm) => (
                  <Button
                    key={dm.id}
                    variant={selectedChat === dm.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedChat(dm.id)}
                  >
                    <div className="relative mr-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" />
                        <AvatarFallback>{dm.name[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                          dm.status === "online"
                            ? "bg-blue-500"
                            : dm.status === "away"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <span className="flex-1 text-left">{dm.name}</span>
                    {dm.unread > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {dm.unread}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* 메인 채팅 영역 */}
      <div className="flex flex-1 flex-col">
        {/* 채팅 헤더 */}
        <div className="border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-500" />
              <div>
                <h2 className="font-semibold">일반</h2>
                <p className="text-sm text-gray-500">
                  팀 전체 공지 및 일반 대화
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 메시지 목록 */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{msg.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <span className="font-medium">{msg.user}</span>
                    <span className="text-sm text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-gray-900">{msg.message}</p>
                  {msg.hasAttachment && (
                    <div className="mt-2 rounded-lg border bg-gray-50 p-3">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">design-mockup.png</span>
                      </div>
                    </div>
                  )}
                  {msg.reactions && (
                    <div className="mt-2 flex space-x-1">
                      {msg.reactions.map((reaction, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                        >
                          {reaction}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* 메시지 입력 */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform space-x-1">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
