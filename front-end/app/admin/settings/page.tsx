"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

import { Loader2, Save, Download, Upload, RefreshCw } from "lucide-react"

// 설정 페이지 래퍼 컴포넌트
export default function SettingsPage() {
  return (
    <SettingsContent />
  )
}

// 설정 페이지 내용 컴포넌트
function SettingsContent() {
  // const { t, language, setLanguage } = { t: (s: string) => s, language: 'ko', setLanguage: () => {} }
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  // 설정 저장 핸들러
  const handleSave = () => {
    setSaving(true)
    // 저장 시뮬레이션
    setTimeout(() => {
      setSaving(false)
      toast({
        title: t("saved"),
        duration: 3000,
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
        <p className="text-muted-foreground">Chill Haven Resort & Spa {t("settings")}</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-6">
          <TabsTrigger value="general">{t("generalSettings")}</TabsTrigger>
          <TabsTrigger value="language">{t("languageSettings")}</TabsTrigger>
          <TabsTrigger value="notification">{t("notificationSettings")}</TabsTrigger>
          <TabsTrigger value="security">{t("securitySettings")}</TabsTrigger>
          <TabsTrigger value="payment">{t("paymentSettings")}</TabsTrigger>
          <TabsTrigger value="ui">{t("uiSettings")}</TabsTrigger>
          <TabsTrigger value="system">{t("systemSettings")}</TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("generalSettings")}</CardTitle>
              <CardDescription>호텔의 기본 정보를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">{t("hotelName")}</Label>
                  <Input id="hotelName" defaultValue="Chill Haven Resort & Spa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelAddress">{t("hotelAddress")}</Label>
                  <Input id="hotelAddress" defaultValue="123 Seaside Avenue, Jeju Island, South Korea" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
                  <Input id="contactEmail" type="email" defaultValue="contact@chillhaven.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{t("contactPhone")}</Label>
                  <Input id="contactPhone" type="tel" defaultValue="+82-64-123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t("timezone")}</Label>
                  <Select defaultValue="Asia/Seoul">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">Asia/Seoul (GMT+9)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">{t("currency")}</Label>
                  <Select defaultValue="KRW">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KRW">KRW (₩)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 언어 설정 */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t("languageSettings")}</CardTitle>
              <CardDescription>시스템 언어 및 지역화 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t("language")}</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">{t("korean")}</SelectItem>
                    <SelectItem value="en">{t("english")}</SelectItem>
                    <SelectItem value="ja">{t("japanese")}</SelectItem>
                    <SelectItem value="zh">{t("chinese")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notification">
          <Card>
            <CardHeader>
              <CardTitle>{t("notificationSettings")}</CardTitle>
              <CardDescription>알림 및 메시지 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t("emailNotifications")}</h4>
                    <p className="text-sm text-muted-foreground">이메일을 통한 알림을 받습니다.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t("smsNotifications")}</h4>
                    <p className="text-sm text-muted-foreground">SMS를 통한 알림을 받습니다.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t("pushNotifications")}</h4>
                    <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다.</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">알림 유형</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p>{t("newReservationAlert")}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>{t("paymentAlert")}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>{t("cancellationAlert")}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("securitySettings")}</CardTitle>
              <CardDescription>계정 및 시스템 보안 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("passwordPolicy")}</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">기본 (최소 8자)</SelectItem>
                      <SelectItem value="medium">중간 (최소 8자, 숫자 포함)</SelectItem>
                      <SelectItem value="strong">강력 (최소 10자, 대소문자, 숫자, 특수문자 포함)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("sessionTimeout")}</Label>
                    <span className="text-sm">30 {t("minutes")}</span>
                  </div>
                  <Slider defaultValue={[30]} max={120} step={5} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t("twoFactorAuth")}</h4>
                    <p className="text-sm text-muted-foreground">관리자 계정에 2단계 인증을 요구합니다.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 결제 설정 */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>{t("paymentSettings")}</CardTitle>
              <CardDescription>결제 방법 및 처리 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("paymentGateways")}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="pg-1" defaultChecked />
                      <Label htmlFor="pg-1">신용카드 (KG이니시스)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="pg-2" defaultChecked />
                      <Label htmlFor="pg-2">카카오페이</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="pg-3" defaultChecked />
                      <Label htmlFor="pg-3">네이버페이</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="pg-4" />
                      <Label htmlFor="pg-4">페이팔</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("taxSettings")}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">부가가치세 (%)</Label>
                      <Input id="tax-rate" type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-fee">서비스 요금 (%)</Label>
                      <Input id="service-fee" type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("refundPolicy")}</Label>
                  <Select defaultValue="flexible">
                    <SelectTrigger>
                      <SelectValue placeholder="Select refund policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">유연함 (체크인 1일 전까지 100% 환불)</SelectItem>
                      <SelectItem value="moderate">보통 (체크인 3일 전까지 100% 환불)</SelectItem>
                      <SelectItem value="strict">엄격함 (체크인 7일 전까지 100% 환불)</SelectItem>
                      <SelectItem value="custom">커스텀 정책</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* UI 설정 */}
        <TabsContent value="ui">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{t("uiSettings")}</CardTitle>
              <CardDescription>사용자 인터페이스 및 디자인 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">{t("theme")}</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>{t("selectTheme")}</Label>
                        <Select defaultValue="light">
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">{t("light")}</SelectItem>
                            <SelectItem value="dark">{t("dark")}</SelectItem>
                            <SelectItem value="system">{t("systemDefault")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4">
                        <h4 className="font-medium mb-2">{t("preview")}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <p className="font-medium mb-1">밝은 테마</p>
                            <div className="h-20 rounded flex items-center justify-center bg-gray-100">
                              <div className="text-black">텍스트 샘플</div>
                            </div>
                          </div>
                          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 shadow-sm">
                            <p className="font-medium mb-1 text-white">어두운 테마</p>
                            <div className="h-20 rounded flex items-center justify-center bg-gray-800">
                              <div className="text-white">텍스트 샘플</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">{t("fontSettings")}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("primaryFont")}</Label>
                        <Select defaultValue="inter">
                          <SelectTrigger>
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="noto-sans">Noto Sans</SelectItem>
                            <SelectItem value="open-sans">Open Sans</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{t("fontSize")}</Label>
                          <span className="text-sm">14px</span>
                        </div>
                        <Slider defaultValue={[14]} min={12} max={18} step={1} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">{t("colorSettings")}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("primaryColor")}</Label>
                        <div className="grid grid-cols-5 gap-2">
                          <Button variant="outline" className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600" />
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600"
                          />
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600"
                          />
                          <Button variant="outline" className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600" />
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-orange-500 hover:bg-orange-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("accentColor")}</Label>
                        <div className="grid grid-cols-5 gap-2">
                          <Button variant="outline" className="h-12 w-12 rounded-full bg-cyan-500 hover:bg-cyan-600" />
                          <Button variant="outline" className="h-12 w-12 rounded-full bg-pink-500 hover:bg-pink-600" />
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-amber-500 hover:bg-amber-600"
                          />
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600"
                          />
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-full bg-indigo-500 hover:bg-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">{t("backgroundSettings")}</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("lightBackground")}</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="h-12 w-full bg-white hover:bg-gray-50">
                              <span className="sr-only">White</span>
                            </Button>
                            <Button variant="outline" className="h-12 w-full bg-gray-50 hover:bg-gray-100">
                              <span className="sr-only">Light Gray</span>
                            </Button>
                            <Button variant="outline" className="h-12 w-full bg-gray-100 hover:bg-gray-200">
                              <span className="sr-only">Gray</span>
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>{t("darkBackground")}</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="h-12 w-full bg-gray-800 hover:bg-gray-700">
                              <span className="sr-only">Dark Gray</span>
                            </Button>
                            <Button variant="outline" className="h-12 w-full bg-gray-900 hover:bg-gray-800">
                              <span className="sr-only">Very Dark Gray</span>
                            </Button>
                            <Button variant="outline" className="h-12 w-full bg-black hover:bg-gray-900">
                              <span className="sr-only">Black</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">{t("borderSettings")}</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>{t("borderRadius")}</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">4px</span>
                          <Slider defaultValue={[4]} min={0} max={16} step={1} className="w-[70%]" />
                          <span className="text-sm">16px</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>{t("borderWidth")}</Label>
                          <span className="text-sm">1px</span>
                        </div>
                        <Slider defaultValue={[1]} min={0} max={4} step={1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 시스템 설정 */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>{t("systemSettings")}</CardTitle>
              <CardDescription>시스템 백업 및 API 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">{t("backupSettings")}</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p>{t("automaticBackup")}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>{t("backupFrequency")}</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">{t("daily")}</SelectItem>
                      <SelectItem value="weekly">{t("weekly")}</SelectItem>
                      <SelectItem value="monthly">{t("monthly")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("lastBackup")}: 2023-04-01 03:00 AM</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    {t("downloadBackup")}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {t("restoreBackup")}
                  </Button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">{t("apiSettings")}</h4>
                <div className="space-y-2">
                  <Label>{t("apiKey")}</Label>
                  <div className="flex gap-2">
                    <Input defaultValue="sk_test_51NcgMpLkjhGfdSaQWerTYuiOP7890ZxcVBnm" type="password" />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t("regenerateKey")}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">{t("integrations")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="int-1" defaultChecked />
                    <Label htmlFor="int-1">Google Analytics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="int-2" defaultChecked />
                    <Label htmlFor="int-2">Booking.com</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="int-3" />
                    <Label htmlFor="int-3">Expedia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="int-4" />
                    <Label htmlFor="int-4">TripAdvisor</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">{t("cancel")}</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {t("save")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

