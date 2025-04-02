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

// 상품 데이터
const products = [
  {
    id: 1,
    name: "럭스 시그니처 아로마 디퓨저",
    price: 58000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "aroma",
    description:
      "럭스 호텔의 시그니처 향을 담은 프리미엄 디퓨저입니다. 은은한 우드와 시트러스 향이 조화롭게 어우러져 호텔의 고급스러운 분위기를 그대로 느낄 수 있습니다. 100% 천연 에센셜 오일을 사용하여 건강하고 오래 지속되는 향을 선사합니다.",
  },
  {
    id: 2,
    name: "럭스 바디 워시",
    price: 35000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bath",
    description:
      "럭스 호텔에서 직접 사용하는 프리미엄 바디 워시입니다. 자연에서 추출한 성분으로 만들어져 피부에 자극 없이 부드럽게 클렌징해주며, 호텔의 시그니처 향이 오래 지속됩니다. 모든 피부 타입에 적합하며 샤워 후에도 촉촉함이 유지됩니다.",
  },
  {
    id: 3,
    name: "럭스 시그니처 베개",
    price: 120000,
    image: "/placeholder.svg?height=400&width=400",
    category: "signature",
    subcategory: "bedding",
    description:
      "럭스 호텔의 객실에서 사용되는 최고급 베개입니다. 100% 구스 다운 충전재를 사용하여 부드러운 감촉과 탁월한 지지력을 제공합니다. 항균 처리된 커버로 위생적이며, 알레르기 방지 기능이 있어 민감한 분들도 안심하고 사용할 수 있습니다.",
  },
  {
    id: 4,
    name: "명상 캔들 세트",
    price: 45000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "meditation",
    description:
      "명상과 휴식을 위한 프리미엄 캔들 세트입니다. 라벤더, 유칼립투스, 샌달우드 향의 3가지 캔들로 구성되어 있으며, 각각 다른 효과를 제공합니다. 100% 소이 왁스로 만들어져 깨끗하게 연소되며, 천연 코튼 심지를 사용하여 최대 50시간 동안 지속됩니다.",
  },
  {
    id: 5,
    name: "럭스 수면 안대",
    price: 28000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "sleep",
    description:
      "완벽한 수면을 위한 프리미엄 실크 안대입니다. 100% 뽕나무 실크로 제작되어 피부에 자극이 없고 부드러운 착용감을 제공합니다. 빛을 완벽하게 차단하여 깊은 수면을 도와주며, 조절 가능한 스트랩으로 편안하게 착용할 수 있습니다.",
  },
  {
    id: 6,
    name: "에센셜 오일 컬렉션",
    price: 65000,
    image: "/placeholder.svg?height=400&width=400",
    category: "wellness",
    subcategory: "aromatherapy",
    description:
      "6가지 프리미엄 에센셜 오일로 구성된 컬렉션입니다. 라벤더, 유칼립투스, 페퍼민트, 티트리, 레몬그라스, 오렌지 오일이 포함되어 있어 다양한 아로마테라피 효과를 경험할 수 있습니다. 100% 천연 성분으로 만들어져 디퓨저, 가습기, 마사지 등 다양한 용도로 사용 가능합니다.",
  },
  {
    id: 7,
    name: "친환경 욕실 세트",
    price: 48000,
    image: "/placeholder.svg?height=400&width=400",
    category: "eco",
    subcategory: "eco-living",
    description:
      "지속 가능한 소재로 만든 친환경 욕실 용품 세트입니다. 대나무 칫솔, 고체 치약, 샴푸 바, 비누 등으로 구성되어 있으며, 모든 제품은 생분해성 포장재를 사용하여 환경 부담을 최소화했습니다. 화학 성분 없이 천연 재료만을 사용하여 건강하고 안전합니다.",
  },
  {
    id: 8,
    name: "유기농 핸드크림 세트",
    price: 42000,
    image: "/placeholder.svg?height=400&width=400",
    category: "eco",
    subcategory: "organic",
    description:
      "유기농 인증을 받은 성분으로 만든 프리미엄 핸드크림 3종 세트입니다. 시어버터, 알로에 베라, 아르간 오일 등 자연에서 얻은 성분이 건조한 손에 깊은 보습을 제공합니다. 파라벤, 실리콘, 인공향료가 첨가되지 않아 민감한 피부에도 안심하고 사용할 수 있습니다.",
  },
  {
    id: 9,
    name: "접이식 여행용 물병",
    price: 25000,
    image: "/placeholder.svg?height=400&width=400",
    category: "eco",
    subcategory: "travel",
    description:
      "여행 시 편리하게 사용할 수 있는 실리콘 접이식 물병입니다. 사용하지 않을 때는 작게 접어 보관할 수 있어 공간을 절약하며, BPA 프리 소재로 만들어져 안전합니다. 누수 방지 캡과 휴대용 스트랩이 포함되어 있어 실용적이며, 식기세척기 사용이 가능합니다.",
  },
  {
    id: 10,
    name: "럭스 시그니처 티 컬렉션",
    price: 38000,
    image: "/placeholder.svg?height=400&width=400",
    category: "food",
    subcategory: "tea",
    description:
      "럭스 호텔에서 엄선한 6가지 프리미엄 차 컬렉션입니다. 얼그레이, 잉글리시 브렉퍼스트, 카모마일, 페퍼민트, 루이보스, 재스민 티가 포함되어 있으며, 모두 유기농 인증을 받은 최고급 찻잎으로 만들어졌습니다. 우아한 패키지로 선물용으로도 적합합니다.",
  },
  {
    id: 11,
    name: "유기농 초콜릿 선물 세트",
    price: 32000,
    image: "/placeholder.svg?height=400&width=400",
    category: "food",
    subcategory: "organic-food",
    description:
      "공정무역 인증을 받은 카카오로 만든 프리미엄 유기농 초콜릿 선물 세트입니다. 다크, 밀크, 화이트 초콜릿과 함께 다양한 견과류와 과일을 혼합한 특별한 맛을 즐길 수 있습니다. 인공 감미료와 방부제가 첨가되지 않아 건강하게 즐길 수 있는 달콤한 간식입니다.",
  },
  {
    id: 12,
    name: "럭스 와인 오프너 세트",
    price: 85000,
    image: "/placeholder.svg?height=400&width=400",
    category: "food",
    subcategory: "wine",
    description:
      "와인을 즐기는 데 필요한 모든 도구가 포함된 프리미엄 와인 오프너 세트입니다. 전문가용 코르크스크류, 와인 스토퍼, 포일 커터, 에어레이터, 온도계로 구성되어 있으며, 고급 가죽 케이스에 담겨 있어 보관과 휴대가 편리합니다. 와인 애호가를 위한 완벽한 선물입니다.",
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

