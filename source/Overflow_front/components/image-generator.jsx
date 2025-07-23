"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Wand2, Download, Share, Copy, Palette, Layers, Sparkles, Clock } from "lucide-react"

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState([
    {
      id: 1,
      url: "/placeholder.svg?height=256&width=256",
      prompt: "미래적인 도시 스카이라인, 네온 조명",
      style: "Cyberpunk",
      createdAt: "2분 전",
    },
    {
      id: 2,
      url: "/placeholder.svg?height=256&width=256",
      prompt: "평화로운 숲 속 오두막",
      style: "Natural",
      createdAt: "5분 전",
    },
    {
      id: 3,
      url: "/placeholder.svg?height=256&width=256",
      prompt: "추상적인 기하학적 패턴",
      style: "Abstract",
      createdAt: "10분 전",
    },
  ])

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // 실제 이미지 생성 API 호출 시뮬레이션
    setTimeout(() => {
      const newImage = {
        id: Date.now(),
        url: "/placeholder.svg?height=256&width=256",
        prompt: prompt,
        style: "Generated",
        createdAt: "방금 전",
      }
      setGeneratedImages([newImage, ...generatedImages])
      setIsGenerating(false)
      setPrompt("")
    }, 3000)
  }

  const presetPrompts = [
    "프로페셔널한 비즈니스 미팅 일러스트",
    "창의적인 브레인스토밍 세션",
    "팀워크를 보여주는 협업 장면",
    "현대적인 오피스 인테리어",
    "디지털 트랜스포메이션 컨셉",
    "혁신적인 아이디어 시각화",
  ]

  const styleOptions = [
    { name: "Realistic", description: "사실적인 스타일" },
    { name: "Illustration", description: "일러스트레이션" },
    { name: "Cartoon", description: "만화 스타일" },
    { name: "Abstract", description: "추상적 스타일" },
    { name: "Minimalist", description: "미니멀 스타일" },
    { name: "Vintage", description: "빈티지 스타일" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">이미지 생성 서비스</h1>
          <p className="text-blue-600 mt-1">AI를 활용한 콘티 및 예시 이미지 생성</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1 bg-blue-100 text-blue-800">
          <Sparkles className="h-4 w-4" />
          <span>AI 기반</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 이미지 생성 패널 */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wand2 className="h-5 w-5" />
                <span>이미지 생성</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">프롬프트</label>
                <Textarea
                  placeholder="생성하고 싶은 이미지를 설명해주세요..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">스타일</label>
                <div className="grid grid-cols-2 gap-2">
                  {styleOptions.map((style) => (
                    <Button key={style.name} variant="outline" size="sm">
                      {style.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    이미지 생성
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 프리셋 프롬프트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>추천 프롬프트</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {presetPrompts.map((preset, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-2"
                    onClick={() => setPrompt(preset)}
                  >
                    <span className="text-sm">{preset}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 생성된 이미지 갤러리 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="gallery" className="space-y-4">
            <TabsList>
              <TabsTrigger value="gallery">갤러리</TabsTrigger>
              <TabsTrigger value="history">히스토리</TabsTrigger>
              <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {generatedImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium truncate">{image.prompt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {image.style}
                        </Badge>
                        <span className="text-xs text-gray-500">{image.createdAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>생성 히스토리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedImages.map((image) => (
                      <div key={image.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.prompt}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{image.prompt}</p>
                          <p className="text-xs text-gray-500">{image.createdAt}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">즐겨찾기한 이미지가 없습니다</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 사용 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>이번 달 사용 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-500">생성된 이미지</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-500">성공률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2.3초</div>
              <div className="text-sm text-gray-500">평균 생성 시간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">45</div>
              <div className="text-sm text-gray-500">공유된 이미지</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
