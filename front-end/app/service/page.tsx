"use client"

import type React from "react"

import { useState } from "react"
import { Search, Phone, Mail, MapPin } from "lucide-react"
import styles from "./service.module.css"

// 공지사항 데이터
const notices = [
  {
    id: 1,
    title: "럭스 호텔 개인정보 처리방침 개정 안내",
    date: "2023-06-15",
    content:
      "안녕하세요, 럭스 호텔입니다. 2023년 7월 1일부로 개인정보 처리방침이 아래와 같이 개정됨을 알려드립니다.\n\n주요 변경사항:\n1. 개인정보 수집 항목 변경\n2. 개인정보 보유 기간 조정\n3. 제3자 제공 관련 조항 명확화\n\n자세한 내용은 당사 웹사이트의 개인정보 처리방침 페이지에서 확인하실 수 있습니다.\n\n언제나 고객님의 개인정보 보호를 최우선으로 생각하는 럭스 호텔이 되겠습니다. 감사합니다.",
  },
  {
    id: 2,
    title: "럭스 호텔 여름 시즌 운영 시간 안내",
    date: "2023-05-21",
    content:
      "안녕하세요, 럭스 호텔입니다.\n\n2023년 여름 시즌을 맞아 일부 시설의 운영 시간이 변경됨을 안내해 드립니다.\n\n1. 수영장: 06:00 - 22:00 (연장 운영)\n2. 루프탑 바: 17:00 - 24:00 (주말 01:00까지 연장)\n3. 스파: 10:00 - 21:00 (변동 없음)\n\n기타 문의사항은 프론트 데스크로 연락 주시기 바랍니다.\n\n쾌적한 여름 휴가를 럭스 호텔에서 즐기시기 바랍니다. 감사합니다.",
  },
  {
    id: 3,
    title: "럭스 호텔 리노베이션 공사 안내",
    date: "2023-04-10",
    content:
      "안녕하세요, 럭스 호텔입니다.\n\n고객님께 더 나은 서비스를 제공하기 위해 2023년 5월 10일부터 6월 30일까지 2층 레스토랑 및 라운지 리노베이션 공사가 진행될 예정입니다.\n\n공사 기간 동안 해당 시설 이용이 제한되며, 대체 식사 공간은 1층 별관에 마련될 예정입니다.\n\n공사로 인한 소음과 불편이 있을 수 있는 점 미리 양해 부탁드리며, 더 좋은 모습으로 찾아뵙겠습니다.\n\n문의사항은 프론트 데스크로 연락 주시기 바랍니다. 감사합니다.",
  },
  {
    id: 4,
    title: "럭스 호텔 시스템 점검 안내",
    date: "2023-03-05",
    content:
      "안녕하세요, 럭스 호텔입니다.\n\n시스템 안정화를 위한 정기 점검이 2023년 3월 15일 오전 2시부터 6시까지 진행될 예정입니다.\n\n점검 시간 동안 웹사이트 및 모바일 앱 서비스 이용이 일시적으로 중단되며, 체크인/체크아웃은 프론트 데스크에서 정상적으로 진행됩니다.\n\n고객님의 양해 부탁드리며, 더 안정적인 서비스를 제공하기 위한 조치임을 이해해 주시기 바랍니다.\n\n감사합니다.",
  },
  {
    id: 5,
    title: "럭스 호텔 멤버십 프로그램 개편 안내",
    date: "2023-02-10",
    content:
      "안녕하세요, 럭스 호텔입니다.\n\n2023년 3월 1일부로 멤버십 프로그램이 개편됨을 안내해 드립니다.\n\n주요 변경사항:\n1. 포인트 적립률 상향 (객실 이용 시 5% → 7%)\n2. 회원 등급 체계 개편 (3단계 → 4단계)\n3. 신규 혜택 추가 (스파 할인, 발레파킹 무료 등)\n\n기존 회원님들의 혜택은 그대로 유지되며, 일부 혜택은 확대 적용됩니다.\n\n자세한 내용은 멤버십 안내 페이지를 참고해 주시기 바랍니다.\n\n더 나은 혜택으로 고객님께 보답하는 럭스 호텔이 되겠습니다. 감사합니다.",
  },
]

// FAQ 데이터
const faqs = [
  {
    id: 1,
    question: "체크인 및 체크아웃 시간은 언제인가요?",
    answer:
      "체크인은 오후 3시, 체크아웃은 정오 12시입니다. 조기 체크인이나 늦은 체크아웃은 사전 요청 시 가능할 수 있으며, 추가 요금이 부과될 수 있습니다.",
  },
  {
    id: 2,
    question: "조식은 객실 요금에 포함되어 있나요?",
    answer:
      "조식 포함 여부는 예약하신 객실 패키지에 따라 다릅니다. 일부 객실 요금에는 조식이 포함되어 있고, 그렇지 않은 경우도 있습니다. 예약 상세 내용을 확인하시거나 고객 서비스로 문의해 주세요.",
  },
  {
    id: 3,
    question: "공항 픽업 서비스를 제공하나요?",
    answer:
      "네, 공항 픽업 서비스를 제공합니다. 원활한 서비스를 위해 도착 24시간 전까지 항공편 정보를 알려주시면 픽업 서비스를 준비해 드립니다. 차량 종류와 거리에 따라 추가 요금이 부과됩니다.",
  },
  {
    id: 4,
    question: "피트니스 센터나 수영장이 있나요?",
    answer:
      "네, 호텔에는 완벽하게 갖춰진 피트니스 센터와 수영장이 있습니다. 피트니스 센터는 투숙객을 위해 24시간 운영되며, 수영장은 매일 오전 6시부터 오후 10시까지 이용 가능합니다.",
  },
  {
    id: 5,
    question: "장애인 편의 시설이 있나요?",
    answer:
      "네, 장애가 있는 고객을 위한 특별히 설계된 객실과 시설이 있습니다. 이에는 휠체어 접근 가능한 객실, 손잡이가 있는 욕실, 경사로와 엘리베이터가 있는 공용 구역이 포함됩니다. 예약 시 특별한 요구 사항이 있으면 알려주세요.",
  },
  {
    id: 6,
    question: "취소 정책은 어떻게 되나요?",
    answer:
      "표준 취소 정책은 체크인 날짜 24시간 전까지 무료 취소가 가능합니다. 체크인 날짜 24시간 이내에 취소하는 경우 1박 숙박비에 해당하는 요금이 부과될 수 있습니다. 특별 요금 및 프로모션은 다른 취소 정책이 적용될 수 있으므로 구체적인 예약 조건을 확인해 주세요.",
  },
]

export default function Service() {
  const [activeTab, setActiveTab] = useState("notice")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotice, setSelectedNotice] = useState<number | null>(null)
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showPhoneNumber, setShowPhoneNumber] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    category: "",
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    title: "",
    content: "",
    agreePrivacy: false,
  })

  const itemsPerPage = 5
  const totalPages = Math.ceil(notices.length / itemsPerPage)

  const filteredNotices = notices.filter((notice) => notice.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const paginatedNotices = filteredNotices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setInquiryForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const {
      category, lastName, firstName, email,
      phone, title, content, agreePrivacy,
    } = inquiryForm
  
    if (
      !category || !lastName || !firstName || !email ||
      !phone || !title || !content || !agreePrivacy
    ) {
      alert("모든 항목을 입력해 주세요.")
      return
    }
  
    try {
      const response = await fetch("/api/qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: category,
          title,
          content,
          email,
        }),
      })
  
      if (!response.ok) throw new Error("서버 오류")
  
      alert("문의가 성공적으로 접수되었습니다.")
      setInquiryForm({
        category: "",
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        title: "",
        content: "",
        agreePrivacy: false,
      })
    } catch (error) {
      console.error("문의 실패:", error)
      alert("문의 접수에 실패했습니다.")
    }
  }
  
  

  const renderTabContent = () => {
    switch (activeTab) {
      case "notice":
        return selectedNotice ? (
          <div className={styles.noticeDetail}>
            <div className={styles.noticeDetailHeader}>
              <h2 className={styles.noticeDetailTitle}>{notices.find((n) => n.id === selectedNotice)?.title}</h2>
              <p className={styles.noticeDetailDate}>{notices.find((n) => n.id === selectedNotice)?.date}</p>
            </div>
            <div className={styles.noticeDetailContent}>
              {notices
                .find((n) => n.id === selectedNotice)
                ?.content.split("\n")
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
            <button className={`button button-outline ${styles.returnButton}`} onClick={() => setSelectedNotice(null)}>
              목록으로 돌아가기
            </button>
          </div>
        ) : (
          <>
            <div className={styles.noticeList}>
              <table className={styles.noticeTable}>
                <thead>
                  <tr>
                    <th className={styles.numberColumn}>번호</th>
                    <th className={styles.titleColumn}>제목</th>
                    <th className={styles.dateColumn}>게시일</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNotices.map((notice) => (
                    <tr key={notice.id}>
                      <td>{notice.id}</td>
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedNotice(notice.id)
                          }}
                        >
                          {notice.title}
                        </a>
                      </td>
                      <td>{notice.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageButton} ${page === currentPage ? styles.activePageButton : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )

      case "faq":
        return (
          <div>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className={styles.faqItem}>
                  <div className={styles.faqQuestion} onClick={() => toggleFaq(faq.id)}>
                    <span>Q. {faq.question}</span>
                    <span>{openFaqId === faq.id ? "−" : "+"}</span>
                  </div>
                  <div className={`${styles.faqAnswer} ${openFaqId === faq.id ? styles.faqAnswerOpen : ""}`}>
                    <p>A. {faq.answer}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center my-8">검색 결과가 없습니다.</p>
            )}
          </div>
        )

        case "inquiry":
          return (
            <form className={styles.inquiryForm} onSubmit={handleInquirySubmit}>
              {/* 상단 경고 문구 */}
              <div className="text-red-600 font-semibold text-sm mb-4">
                ※ 모든 항목은 필수 입력입니다.
              </div>
        
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.formLabel}>문의 유형</label>
                <select
                  id="category"
                  name="category"
                  className={styles.formSelect}
                  value={inquiryForm.category}
                  onChange={handleInquiryChange}
                >
                  <option value="">선택해주세요</option>
                  <option value="reservation">예약 문의</option>
                  <option value="facility">시설 문의</option>
                  <option value="dining">다이닝 문의</option>
                  <option value="event">이벤트/프로모션 문의</option>
                  <option value="others">기타 문의</option>
                </select>
              </div>
        
              <div className={styles.nameGroup}>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.formLabel}>성</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className={styles.formInput}
                    value={inquiryForm.lastName}
                    onChange={handleInquiryChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.formLabel}>이름</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={styles.formInput}
                    value={inquiryForm.firstName}
                    onChange={handleInquiryChange}
                  />
                </div>
              </div>
        
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.formInput}
                  value={inquiryForm.email}
                  onChange={handleInquiryChange}
                />
              </div>
        
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.formLabel}>연락처</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.formInput}
                  value={inquiryForm.phone}
                  onChange={handleInquiryChange}
                />
              </div>
        
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>제목</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={styles.formInput}
                  value={inquiryForm.title}
                  onChange={handleInquiryChange}
                />
              </div>
        
              <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.formLabel}>내용</label>
                <textarea
                  id="content"
                  name="content"
                  className={styles.formTextarea}
                  value={inquiryForm.content}
                  onChange={handleInquiryChange}
                ></textarea>
              </div>
        
              <div className={styles.formCheckboxContainer}>
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  name="agreePrivacy"
                  className={styles.formCheckbox}
                  checked={inquiryForm.agreePrivacy}
                  onChange={handleInquiryChange}
                />
                <label htmlFor="agreePrivacy">개인정보 수집 및 이용에 동의합니다. (필수)</label>
              </div>
        
              <div className="text-center mt-6">
                <button type="submit" className="button button-primary">
                  문의하기
                </button>
              </div>
            </form>
          )
        

          case "contact":
            return (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
          
                {/* 지도 먼저 */}
                <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-sm mb-8">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.3657406402185!2d127.0292885!3d37.4978715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca158fce15c81%3A0x9a79e65b3e3c3c2d!2z7ISc7Jq47Yq567OE7IucIOyEnOy5tOydtOyLnCDrqqjsoJXrj5kgMTIz!5e0!3m2!1sko!2skr!4v1714262016961!5m2!1sko!2skr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="호텔 위치 지도"
                  ></iframe>
                </div>
          
                {/* 지도 아래 연락처 정보 */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          
                  {/* 주소 */}
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="bg-primary-color/10 rounded-full p-3 mb-2 flex items-center justify-center">
                      <MapPin size={24} className="text-primary-color" />
                    </div>
                    <h3 className="font-semibold text-base mb-1">주소</h3>
                    <p className="text-gray-700 text-sm break-keep">서울특별시 강남구 테헤란로 123<br />럭스타워</p>
                  </div>
          
                  {/* 구분선 */}
                  <div className="hidden md:block h-16 border-l border-gray-300"></div>
          
                  {/* 전화번호 */}
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="bg-primary-color/10 rounded-full p-3 mb-2 flex items-center justify-center">
                      <Phone size={24} className="text-primary-color" />
                    </div>
                    <h3 className="font-semibold text-base mb-1">전화번호</h3>
                    <p className="text-gray-700 text-sm">02-123-4567</p>
                    <p className="text-xs text-gray-500 mt-1">(24시간 운영)</p>
                  </div>
          
                  {/* 구분선 */}
                  <div className="hidden md:block h-16 border-l border-gray-300"></div>
          
                  {/* 이메일 */}
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className="bg-primary-color/10 rounded-full p-3 mb-2 flex items-center justify-center">
                      <Mail size={24} className="text-primary-color" />
                    </div>
                    <h3 className="font-semibold text-base mb-1">이메일</h3>
                    <p className="text-gray-700 text-sm break-all">info@luxehotel.com</p>
                  </div>
                </div>
              </div>
            )
      default:
        return null
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>고객센터</h1>
          <p>
            럭스 호텔은 항상 고객님의 편안한 경험을 위해 노력하고 있습니다. 궁금한 점이나 도움이 필요하신 사항이 있으면
            언제든지 문의해 주세요.
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === "notice" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("notice")}
            >
              공지사항
            </button>
            <button
              className={`${styles.tab} ${activeTab === "faq" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
            </button>
            <button
              className={`${styles.tab} ${activeTab === "inquiry" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("inquiry")}
            >
              문의
            </button>
            <button
              className={`${styles.tab} ${activeTab === "contact" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Us
            </button>
          </div>

          {(activeTab === "notice" || activeTab === "faq") && !selectedNotice && (
            <form onSubmit={handleSearch} className="flex mt-4 md:mt-0">
              <input
                type="text"
                placeholder="검색어 입력..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="button button-primary">
                <Search size={16} className="mr-1" /> 검색
              </button>
            </form>
          )}
        </div>

        {renderTabContent()}
      </div>
    </>
  )
}
