"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import styles from "./store.module.css"

// 카테고리 데이터
const categories = [
  {
    id: "signature",
    name: "시그니처 컬렉션",
    subcategories: [
      { id: "aroma", name: "아로마 & 디퓨저" },
      { id: "bath", name: "목욕 제품" },
      { id: "bedding", name: "침구 & 가운" },
    ],
  },
  {
    id: "wellness",
    name: "힐링 & 웰니스 컬렉션",
    subcategories: [
      { id: "meditation", name: "명상 & 요가" },
      { id: "sleep", name: "수면 & 릴렉스" },
      { id: "aromatherapy", name: "아로마테라피" },
    ],
  },
  {
    id: "eco",
    name: "에코 & 지속가능한 라이프스타일",
    subcategories: [
      { id: "eco-living", name: "친환경 생활용품" },
      { id: "organic", name: "유기농 퍼스널 케어" },
      { id: "travel", name: "지속가능한 여행용품" },
    ],
  },
  {
    id: "food",
    name: "휴식을 위한 식음료 제품",
    subcategories: [
      { id: "tea", name: "차 & 티웨어" },
      { id: "organic-food", name: "유기농 식품" },
      { id: "wine", name: "와인 & 음료" },
    ],
  },
  {
    id: "room",
    name: "객실 등급별 맞춤 컬렉션",
    subcategories: [
      { id: "comfort", name: "컴포트 & 하모니 컬렉션" },
      { id: "family", name: "패밀리 & 레이크 컬렉션" },
      { id: "ultimate", name: "얼티메이트 컬렉션" },
    ],
  },
  {
    id: "memory",
    name: "메모리 & 컬렉터블 아이템",
    subcategories: [
      { id: "photo", name: "포토 & 아트" },
      { id: "miniature", name: "미니어처 & 피규어" },
      { id: "seasonal", name: "시즌 & 한정판 컬렉션" },
    ],
  },
]

// 상품 데이터 - 상세 페이지와 일치시킴
const products = [
  {
    id: 1,
    name: "호텔 시그니처 베개",
    price: 89000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bedding",
    description:
      "호텔에서 경험한 편안한 수면을 집에서도 느껴보세요. 최고급 소재로 제작된 시그니처 베개는 목과 어깨의 피로를 줄여주고 숙면을 도와줍니다.",
    features: ["100% 유기농 면 커버", "저자극성 소재", "인체공학적 디자인", "세탁기 사용 가능", "항균 처리"],
  },
  {
    id: 2,
    name: "프리미엄 목욕 가운",
    price: 150000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bath",
    description:
      "호텔의 럭셔리함을 집에서도 경험해보세요. 부드러운 터치감과 뛰어난 흡수력을 갖춘 프리미엄 목욕 가운으로 일상 속 작은 사치를 즐겨보세요.",
    features: ["100% 터키산 면", "고밀도 직조", "뛰어난 흡수력", "남녀공용 디자인", "세탁기 사용 가능"],
  },
  {
    id: 3,
    name: "아로마 디퓨저",
    price: 75000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "aroma",
    description:
      "호텔의 시그니처 향기를 집에서도 경험해보세요. 천연 에센셜 오일을 사용한 아로마 디퓨저는 공간에 은은한 향기를 퍼뜨려 편안한 분위기를 만들어줍니다.",
    features: ["천연 에센셜 오일 사용", "최대 8시간 지속", "자동 전원 차단 기능", "LED 무드등 포함", "저소음 설계"],
  },
  {
    id: 4,
    name: "럭셔리 바스 타월 세트",
    price: 120000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bath",
    description:
      "호텔급 럭셔리 타월 세트로 일상 속 작은 사치를 경험해보세요. 부드러운 터치감과 뛰어난 흡수력을 갖춘 프리미엄 타월입니다.",
    features: [
      "100% 이집트산 면",
      "고밀도 직조",
      "뛰어난 흡수력",
      "대형 타월 2장, 핸드 타월 2장 구성",
      "세탁기 사용 가능",
    ],
  },
  {
    id: 5,
    name: "시그니처 룸 스프레이",
    price: 65000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "aromatherapy",
    description:
      "호텔의 시그니처 향기를 담은 룸 스프레이로 공간에 고급스러운 향기를 더해보세요. 천연 성분으로 만들어져 안심하고 사용할 수 있습니다.",
    features: ["천연 에센셜 오일 함유", "알코올 프리 포뮬러", "지속력 강화", "100ml 용량", "재사용 가능한 유리 용기"],
  },
  {
    id: 6,
    name: "호텔 슬리퍼 세트",
    price: 45000,
    image: "/placeholder.svg?height=400&width=400",
    category: "eco",
    subcategory: "eco-living",
    description:
      "호텔에서 느꼈던 편안함을 집에서도 경험해보세요. 부드러운 소재와 인체공학적 디자인으로 제작된 슬리퍼는 하루의 피로를 풀어줍니다.",
    features: ["메모리폼 쿠션", "논슬립 밑창", "통기성 소재", "남녀공용 디자인", "2켤레 세트"],
  },
  {
    id: 7,
    name: "럭스 시그니처 아로마 디퓨저",
    price: 58000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "aroma",
    description:
      "럭스 호텔의 시그니처 향을 담은 프리미엄 디퓨저입니다. 은은한 우드와 시트러스 향이 조화롭게 어우러져 호텔의 고급스러운 분위기를 그대로 느낄 수 있습니다.",
  },
  {
    id: 8,
    name: "럭스 바디 워시",
    price: 35000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bath",
    description:
      "럭스 호텔에서 직접 사용하는 프리미엄 바디 워시입니다. 자연에서 추출한 성분으로 만들어져 피부에 자극 없이 부드럽게 클렌징해주며, 호텔의 시그니처 향이 오래 지속됩니다.",
  },
  {
    id: 9,
    name: "럭스 시그니처 베개",
    price: 120000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bedding",
    description:
      "럭스 호텔의 객실에서 사용되는 최고급 베개입니다. 100% 구스 다운 충전재를 사용하여 부드러운 감촉과 탁월한 지지력을 제공합니다.",
  },
  {
    id: 10,
    name: "명상 캔들 세트",
    price: 45000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "meditation",
    description:
      "명상과 휴식을 위한 프리미엄 캔들 세트입니다. 라벤더, 유칼립투스, 샌달우드 향의 3가지 캔들로 구성되어 있으며, 각각 다른 효과를 제공합니다.",
  },
  {
    id: 11,
    name: "럭스 수면 안대",
    price: 28000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "sleep",
    description:
      "완벽한 수면을 위한 프리미엄 실크 안대입니다. 100% 뽕나무 실크로 제작되어 피부에 자극이 없고 부드러운 착용감을 제공합니다.",
  },
  {
    id: 12,
    name: "에센셜 오일 컬렉션",
    price: 65000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "aromatherapy",
    description:
      "6가지 프리미엄 에센셜 오일로 구성된 컬렉션입니다. 라벤더, 유칼립투스, 페퍼민트, 티트리, 레몬그라스, 오렌지 오일이 포함되어 있어 다양한 아로마테라피 효과를 경험할 수 있습니다.",
  },
]

export default function Store() {
  const [activeCategory, setActiveCategory] = useState("signature")
  const [activeSubcategory, setActiveSubcategory] = useState("all")

  const filteredProducts = products.filter((product) => {
    if (activeSubcategory === "all") {
      return product.category === activeCategory
    }
    return product.category === activeCategory && product.subcategory === activeSubcategory
  })

  const currentCategory = categories.find((cat) => cat.id === activeCategory)

  useEffect(() => {
    // 카테고리가 변경되면 서브카테고리를 'all'로 초기화
    setActiveSubcategory("all")
  }, [activeCategory])

  return (
    <>
      <div className={styles.header}>
        <div className="container">
          <h1>기프트샵</h1>
          <p>
            럭스 호텔의 특별한 경험을 집에서도 느껴보세요. 호텔에서 직접 사용하는 제품부터 특별히 엄선된 아이템까지
            다양하게 준비되어 있습니다.
          </p>
        </div>
      </div>

      <section className={styles.storeSection}>
        <div className="container">
          <div className={styles.storeGrid}>
            {/* 카테고리 사이드바 */}
            <div className={styles.categorySidebar}>
              <h2 className={styles.categoryTitle}>카테고리</h2>
              <ul className={styles.categoryList}>
                {categories.map((category) => (
                  <li key={category.id} className={styles.categoryItem}>
                    <a
                      href="#"
                      className={`${styles.categoryLink} ${activeCategory === category.id ? styles.activeCategory : ""}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveCategory(category.id)
                      }}
                    >
                      {category.name}
                    </a>

                    {activeCategory === category.id && (
                      <ul className={styles.subcategoryList}>
                        <li className={styles.subcategoryItem}>
                          <a
                            href="#"
                            className={`${styles.subcategoryLink} ${activeSubcategory === "all" ? styles.activeSubcategory : ""}`}
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveSubcategory("all")
                            }}
                          >
                            전체 보기
                          </a>
                        </li>
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory.id} className={styles.subcategoryItem}>
                            <a
                              href="#"
                              className={`${styles.subcategoryLink} ${activeSubcategory === subcategory.id ? styles.activeSubcategory : ""}`}
                              onClick={(e) => {
                                e.preventDefault()
                                setActiveSubcategory(subcategory.id)
                              }}
                            >
                              {subcategory.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 상품 목록 */}
            <div>
              <div className={styles.breadcrumbs}>
                <Link href="/store" className={styles.breadcrumbLink}>
                  기프트샵
                </Link>
                <span className={styles.breadcrumbSeparator}>
                  <ChevronRight size={14} />
                </span>
                <span className={styles.breadcrumbCurrent}>{currentCategory?.name}</span>
                {activeSubcategory !== "all" && (
                  <>
                    <span className={styles.breadcrumbSeparator}>
                      <ChevronRight size={14} />
                    </span>
                    <span className={styles.breadcrumbCurrent}>
                      {currentCategory?.subcategories.find((sub) => sub.id === activeSubcategory)?.name}
                    </span>
                  </>
                )}
              </div>

              <div className={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <Link href={`/store/${product.id}`} key={product.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={styles.productContent}>
                      <div className={styles.productCategory}>
                        {currentCategory?.subcategories.find((sub) => sub.id === product.subcategory)?.name ||
                          product.subcategory}
                      </div>
                      <h3 className={styles.productTitle}>{product.name}</h3>
                      <div className={styles.productPrice}>{product.price.toLocaleString()}원</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

