"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Plus, Bell, Users, MapPin, Video, AlertCircle, CheckCircle, Filter } from "lucide-react"

export function ScheduleManager() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const upcomingEvents = [
    {
      id: 1,
      title: "클라이언트 프레젠테이션",
      type: "meeting",
      time: "14:00 - 15:30",
      date: "오늘",
      location: "회의실 A",
      attendees: ["김철수", "이영희", "박민수"],
      priority: "high",
      reminder: "15분 전",
    },
    {
      id: 2,
      title: "디자인 리뷰",
      type: "review",
      time: "16:00 - 17:00",
      date: "오늘",
      location: "온라인",
      attendees: ["이영희", "최디자인"],
      priority: "medium",
      reminder: "30분 전",
    },
    {
      id: 3,
      title: "프로젝트 데드라인",
      type: "deadline",
      time: "23:59",
      date: "내일",
      location: "-",
      attendees: [],
      priority: "high",
      reminder: "1일 전",
    },
    {
      id: 4,
      title: "팀 스탠드업 미팅",
      type: "meeting",
      time: "09:30 - 10:00",
      date: "내일",
      location: "온라인",
      attendees: ["전체팀"],
      priority: "low",
      reminder: "10분 전",
    },
  ]

  const personalTasks = [
    { id: 1, title: "보고서 작성 완료", deadline: "오늘 18:00", completed: false, priority: "high" },
    { id: 2, title: "클라이언트 이메일 답변", deadline: "내일 10:00", completed: false, priority: "medium" },
    { id: 3, title: "디자인 에셋 정리", deadline: "이번 주", completed: true, priority: "low" },
    { id: 4, title: "프로젝트 문서 업데이트", deadline: "다음 주", completed: false, priority: "medium" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "medium":
        return "bg-blue-50 text-blue-700 border-blue-100"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "review":
        return <CheckCircle className="h-4 w-4" />
      case "deadline":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">스케줄 관리</h1>
          <p className="text-blue-600 mt-1">회의, 개인 일정, 데드라인을 한눈에 관리하세요</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent">
            <Bell className="mr-2 h-4 w-4" />
            알림 설정
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />새 일정
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 오늘의 일정 */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>다가오는 일정</CardTitle>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getPriorityColor(event.priority)}`}>
                          {getTypeIcon(event.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{event.date}</span>
                            </div>
                            {event.location !== "-" && (
                              <div className="flex items-center space-x-1">
                                {event.location === "온라인" ? (
                                  <Video className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={getPriorityColor(event.priority)}>
                        {event.priority === "high" ? "높음" : event.priority === "medium" ? "보통" : "낮음"}
                      </Badge>
                    </div>

                    {event.attendees.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="text-sm text-gray-500">참석자:</span>
                        <div className="flex items-center space-x-1">
                          {event.attendees.slice(0, 3).map((attendee, index) => (
                            <Avatar key={index} className="h-6 w-6">
                              <AvatarFallback className="text-xs">{attendee[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                          {event.attendees.length > 3 && (
                            <span className="text-xs text-gray-500">+{event.attendees.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Bell className="h-3 w-3" />
                        <span>알림: {event.reminder}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          수정
                        </Button>
                        <Button variant="ghost" size="sm">
                          참여
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드 패널 */}
        <div className="space-y-4">
          {/* 개인 작업 */}
          <Card>
            <CardHeader>
              <CardTitle>개인 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalTasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="mt-1">
                      {task.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{task.deadline}</span>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority === "high" ? "높음" : task.priority === "medium" ? "보통" : "낮음"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 이번 주 요약 */}
          <Card>
            <CardHeader>
              <CardTitle>이번 주 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">총 일정</span>
                  <span className="font-semibold text-blue-600">12개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">완료된 작업</span>
                  <span className="font-semibold text-blue-600">8개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">다가오는 데드라인</span>
                  <span className="font-semibold text-blue-600">3개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">평균 회의 시간</span>
                  <span className="font-semibold text-blue-600">1.2시간</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 빠른 작업 */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                회의 일정 추가
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                리마인더 설정
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />팀 캘린더 보기
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                알림 관리
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
