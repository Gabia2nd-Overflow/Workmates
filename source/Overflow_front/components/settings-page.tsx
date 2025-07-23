"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Palette, Globe, Database, Key, Mail, Smartphone, Monitor, Moon, Sun } from "lucide-react"

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
    mobile: true,
  })

  const [theme, setTheme] = useState("light")

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">설정</h1>
          <p className="text-blue-600 mt-1">계정 및 애플리케이션 설정을 관리하세요</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
          <TabsTrigger value="appearance">외관</TabsTrigger>
          <TabsTrigger value="integrations">연동</TabsTrigger>
          <TabsTrigger value="advanced">고급</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>프로필 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" />
                    <AvatarFallback>김철수</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">프로필 사진 변경</Button>
                    <p className="text-sm text-gray-500">JPG, PNG 파일만 업로드 가능합니다.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" defaultValue="김철수" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" defaultValue="kim@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <Input id="phone" defaultValue="010-1234-5678" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">부서</Label>
                    <Input id="department" defaultValue="개발팀" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">소개</Label>
                  <Input id="bio" placeholder="간단한 자기소개를 입력하세요" />
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700">변경사항 저장</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>알림 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="font-medium">이메일 알림</span>
                      </div>
                      <p className="text-sm text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <span className="font-medium">푸시 알림</span>
                      </div>
                      <p className="text-sm text-gray-500">실시간 알림을 받습니다</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span className="font-medium">데스크톱 알림</span>
                      </div>
                      <p className="text-sm text-gray-500">브라우저 알림을 받습니다</p>
                    </div>
                    <Switch
                      checked={notifications.desktop}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, desktop: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span className="font-medium">모바일 알림</span>
                      </div>
                      <p className="text-sm text-gray-500">모바일 앱 알림을 받습니다</p>
                    </div>
                    <Switch
                      checked={notifications.mobile}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, mobile: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>보안 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">현재 비밀번호</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">비밀번호 확인</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">비밀번호 변경</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>2단계 인증</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">2단계 인증 활성화</p>
                    <p className="text-sm text-gray-500">계정 보안을 강화합니다</p>
                  </div>
                  <Switch />
                </div>
                <Button variant="outline">인증 앱 설정</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>테마 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className={`h-20 flex-col ${theme === "light" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6 mb-2" />
                    라이트
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="h-20 flex-col"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6 mb-2" />
                    다크
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="h-20 flex-col"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-6 w-6 mb-2" />
                    시스템
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>언어 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="language">언어</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>외부 서비스 연동</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Google Drive", status: "connected", description: "파일 저장 및 동기화" },
                  { name: "Slack", status: "connected", description: "팀 커뮤니케이션" },
                  { name: "Trello", status: "disconnected", description: "프로젝트 관리" },
                  { name: "GitHub", status: "disconnected", description: "코드 저장소" },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={service.status === "connected" ? "default" : "secondary"}
                        className={
                          service.status === "connected" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {service.status === "connected" ? "연결됨" : "연결 안됨"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {service.status === "connected" ? "해제" : "연결"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>고급 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">개발자 모드</p>
                    <p className="text-sm text-gray-500">고급 기능에 접근할 수 있습니다</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">베타 기능</p>
                    <p className="text-sm text-gray-500">실험적 기능을 사용할 수 있습니다</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">사용 데이터 수집</p>
                    <p className="text-sm text-gray-500">서비스 개선을 위한 익명 데이터 수집</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>데이터 관리</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full bg-transparent">
                  데이터 내보내기
                </Button>
                <Button variant="destructive" className="w-full">
                  계정 삭제
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
