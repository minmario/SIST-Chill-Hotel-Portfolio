"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import styles from "./store.module.css"
import { fetchProducts, fetchProductsByCategory, Product } from "@/lib/api"

// 카테고리 데이터
const categories = [
  {
    id: "all",
    name: "전체 상품",
    subcategories: [],
  },
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

export default function Store() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeSubcategory, setActiveSubcategory] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("상품 목록 로딩 시작")
        setLoading(true)
        
        // 카테고리가 선택된 경우 해당 카테고리 상품만 로드
        let data: Product[]
        if (activeCategory !== "all") {
          data = await fetchProductsByCategory(activeCategory)
        } else {
          data = await fetchProducts()
        }
        
        console.log("받은 상품 데이터:", data)
        setProducts(data)
        setLoading(false)
      } catch (err) {
        console.error("상품 로딩 오류:", err)
        setError(err instanceof Error ? err.message : '상품을 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    loadProducts()
  }, [activeCategory]) // 카테고리가 변경될 때마다 상품 목록 다시 로드

  const filteredProducts = products.filter((product) => {
    // 현재는 모든 상품을 표시하되, 추후에 백엔드에서 카테고리 필터링 기능이 구현되면 변경 가능
    return true
    
    // 기존 필터링 로직 (백엔드 API 데이터 구조와 맞지 않아 주석 처리)
    // if (activeSubcategory === "all") {
    //   return product.category === activeCategory
    // }
    // return product.category === activeCategory && product.subcategory === activeSubcategory
  })

  const currentCategory = categories.find((cat) => cat.id === activeCategory)

  useEffect(() => {
    // 카테고리가 변경되면 서브카테고리를 'all'로 초기화
    setActiveSubcategory("all")
  }, [activeCategory])

  if (loading) return <div className="container mx-auto p-4">상품 로딩 중...</div>
  if (error) return <div className="container mx-auto p-4 text-red-500">오류: {error}</div>

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
                {products.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link href={`/store/${product.itemIdx}`} key={product.itemIdx} className={styles.productCard}>
                      <div className={styles.productImage}>
                        <Image
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.itemName}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className={styles.productContent}>
                        <div className={styles.productCategory}>
                          {product.category}
                        </div>
                        <h3 className={styles.productTitle}>{product.itemName}</h3>
                        <div className={styles.productPrice}>{Number(product.price).toLocaleString()}원</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center p-8 w-full">
                    <p>해당 카테고리에 상품이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

