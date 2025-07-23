"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Download,
  Globe,
  ImageIcon,
  FileText,
  Music,
  Play,
  RefreshCw,
  Filter,
  Bookmark,
  ExternalLink,
} from "lucide-react"

export function CrawlingTool() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)

  const crawlingResults = {
    images: [
      {
        id: 1,
        url: "/placeholder.svg?height=200&width=200",
        title: "디자인 레퍼런스 1",
        source: "dribbble.com",
        size: "1.2MB",
      },
      {
        id: 2,
        url: "/placeholder.svg?height=200&width=200",
        title: "UI 컴포넌트 예시",
        source: "behance.net",
        size: "800KB",
      },
      {
        id: 3,
        url: "/placeholder.svg?height=200&width=200",
        title: "브랜딩 아이디어",
        source: "pinterest.com",
        size: "1.5MB",
      },
      {
        id: 4,
        url: "/placeholder.svg?height=200&width=200",
        title: "컬러 팔레트",
        source: "coolors.co",
        size: "600KB",
      },
    ],
    texts: [
      {
        id: 1,
        title: "최신 디자인 트렌드 2024",
        content: "올해 주목해야 할 디자인 트렌드는...",
        source: "design-blog.com",
        length: "2,340자",
      },
      {
        id: 2,
        title: "UX 디자인 베스트 프랙티스",
        content: "사용자 경험을 향상시키는 방법...",
        source: "ux-magazine.com",
        length: "1,890자",
      },
      {
        id: 3,
        title: "브랜딩 전략 가이드",
        content: "효과적인 브랜딩을 위한 전략...",
        source: "marketing-today.com",
        length: "3,120자",
      },
    ],
    sounds: [
      { id: 1, title: "배경음악 - 집중", duration: "3:45", source: "freesound.org", size: "5.2MB" },
      { id: 2, title: "효과음 - 알림", duration: "0:12", source: "zapsplat.com", size: "180KB" },
      { id: 3, title: "앰비언트 사운드", duration: "10:30", source: "ambient-mixer.com", size: "12.8MB" },
    ],
  }

  const recentSearches = ["디자인 레퍼런스", "UI 컴포넌트", "브랜딩 아이디어", "마케팅 소재", "프레젠테이션 템플릿"]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchProgress(0)

    // 검색 진행률 시뮬레이션
    const interval = setInterval(() => {
      setSearchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSearching(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">크롤링 도구</h1>
          <p className="text-blue-600 mt-1">작업에 필요한 레퍼런스와 소재를 수집하세요</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1 bg-blue-100 text-blue-800">
          <Globe className="h-4 w-4" />
          <span>웹 크롤링</span>
        </Badge>
      </div>

      {/* 검색 인터페이스 */}
      <Card>
        <CardHeader>
          <CardTitle>레퍼런스 검색</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="검색할 키워드를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
                disabled={isSearching}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {isSearching && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>검색 중...</span>
                <span>{searchProgress}%</span>
              </div>
              <Progress value={searchProgress} className="h-2" />
            </div>
          )}

          {/* 최근 검색어 */}
          <div>
            <p className="text-sm font-medium mb-2">최근 검색어</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setSearchQuery(search)}>
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      <Tabs defaultValue="images" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="images" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>이미지 ({crawlingResults.images.length})</span>
          </TabsTrigger>
          <TabsTrigger value="texts" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>텍스트 ({crawlingResults.texts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="sounds" className="flex items-center space-x-2">
            <Music className="h-4 w-4" />
            <span>사운드 ({crawlingResults.sounds.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {crawlingResults.images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img src={image.url || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate">{image.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{image.source}</span>
                    <span>{image.size}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="texts">
          <div className="space-y-4">
            {crawlingResults.texts.map((text) => (
              <Card key={text.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{text.title}</h3>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{text.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{text.source}</span>
                    <span>{text.length}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sounds">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crawlingResults.sounds.map((sound) => (
              <Card key={sound.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{sound.title}</h3>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{sound.source}</span>
                    <div className="flex items-center space-x-2">
                      <span>{sound.duration}</span>
                      <span>•</span>
                      <span>{sound.size}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 수집 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>이번 달 수집 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-500">수집된 이미지</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">567</div>
              <div className="text-sm text-gray-500">텍스트 문서</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">89</div>
              <div className="text-sm text-gray-500">사운드 파일</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45</div>
              <div className="text-sm text-gray-500">즐겨찾기</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
