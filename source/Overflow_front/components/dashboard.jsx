import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare, FileText, TrendingUp, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"

export function Dashboard() {
  const stats = [
    { title: "활성 프로젝트", value: "12", icon: FileText, change: "+2" },
    { title: "팀 멤버", value: "48", icon: Users, change: "+5" },
    { title: "오늘 메시지", value: "234", icon: MessageSquare, change: "+12%" },
    { title: "완료율", value: "78%", icon: TrendingUp, change: "+5%" },
  ]

  const recentProjects = [
    { name: "웹사이트 리뉴얼", progress: 85, status: "active", deadline: "2024-01-15" },
    { name: "모바일 앱 개발", progress: 60, status: "active", deadline: "2024-01-20" },
    { name: "브랜딩 프로젝트", progress: 95, status: "review", deadline: "2024-01-10" },
    { name: "마케팅 캠페인", progress: 40, status: "active", deadline: "2024-01-25" },
  ]

  const upcomingTasks = [
    { title: "클라이언트 미팅", time: "14:00", type: "meeting" },
    { title: "디자인 리뷰", time: "16:30", type: "review" },
    { title: "프로젝트 데드라인", time: "내일", type: "deadline" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">대시보드</h1>
          <p className="text-blue-600 mt-1">프로젝트 현황과 팀 활동을 한눈에 확인하세요</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Calendar className="mr-2 h-4 w-4" />새 프로젝트
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{stat.value}</div>
                <p className="text-xs text-blue-600 mt-1">{stat.change} 지난 주 대비</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 프로젝트 진행 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>프로젝트 진행 현황</CardTitle>
            <CardDescription>현재 진행 중인 프로젝트들의 상태</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{project.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status === "active" ? "진행중" : "검토중"}
                    </Badge>
                    <span className="text-sm text-gray-500">{project.deadline}</span>
                  </div>
                </div>
                <Progress value={project.progress} className="h-2 bg-blue-100" />
                <div className="text-sm text-gray-500">{project.progress}% 완료</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 오늘의 일정 */}
        <Card>
          <CardHeader>
            <CardTitle>오늘의 일정</CardTitle>
            <CardDescription>예정된 미팅과 데드라인</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {task.type === "meeting" && <Users className="h-5 w-5 text-blue-500" />}
                  {task.type === "review" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {task.type === "deadline" && <AlertCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.time}</p>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 팀 활동 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>팀 활동 요약</CardTitle>
          <CardDescription>최근 7일간의 팀 활동 분석</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-500">총 메시지</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-500">완료된 작업</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-sm text-gray-500">파일 공유</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
