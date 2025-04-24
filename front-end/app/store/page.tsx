"use client"

import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import styles from "./store.module.css"
import { fetchProducts, fetchProductsByCategory, Product, SortBy, SortDirection, sortProducts } from "@/lib/api"

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

// 정렬 옵션 데이터
const sortOptions = [
  { value: SortBy.NEWEST, label: "최신순" },
  { value: SortBy.PRICE, label: "가격순" },
  { value: SortBy.NAME, label: "이름순" },
]

// 카테고리 표시 형식 포맷 함수
const formatCategory = (category: string | undefined): string => {
  if (!category) return "기타"

  // 카테고리 맵핑
  const categoryMap: { [key: string]: string } = {
    "signature": "시그니처 컬렉션",
    "wellness": "힐링 & 웰니스",
    "eco": "에코 & 지속가능",
    "food": "식음료 제품",
    "room": "객실별 컬렉션",
    "memory": "메모리 아이템",
    // 서브카테고리
    "aroma": "아로마 & 디퓨저",
    "bath": "목욕 제품",
    "bedding": "침구 & 가운",
    // 기타 서브카테고리...
  }

  // 슬래시 또는 하이픈 형식의 카테고리 처리
  if (category.includes("/") || category.includes("-")) {
    const separator = category.includes("/") ? "/" : "-"
    const [main, sub] = category.split(separator)
    
    const mainLabel = categoryMap[main] || main
    const subLabel = categoryMap[sub] || sub
    
    return `${mainLabel} > ${subLabel}`
  }
  
  return categoryMap[category] || category
}

export default function Store() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeSubcategory, setActiveSubcategory] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>([]) // 모든 상품 데이터 저장
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.NEWEST)
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.DESC)

  // 초기 로딩 시 모든 상품 가져오기
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        const data = await fetchProducts(sortBy, sortDirection)
        setAllProducts(data)
      } catch (err) {
        console.error("모든 상품 로딩 오류:", err)
      }
    }
    
    loadAllProducts()
  }, [sortBy, sortDirection])

  // 먼저 belongsToCategory 함수 정의
  const belongsToCategory = useCallback((productCategory: string | undefined, mainCategory: string): boolean => {
    if (!productCategory) return false
    if (mainCategory === "all") return true

    // 하이픈 및 슬래시 카테고리 형식 모두 지원
    if (productCategory === mainCategory) return true
    if (productCategory.startsWith(`${mainCategory}-`)) return true
    if (productCategory.startsWith(`${mainCategory}/`)) return true

    return false
  }, [])

  // 그 다음 loadProducts 함수 정의
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let data: Product[] = []
      
      if (activeCategory === "all") {
        // 전체 상품 표시 (클라이언트측에서 필터링)
        data = [...allProducts]
      } else if (activeSubcategory === "all") {
        // 특정 메인 카테고리에 속한 상품 표시
        try {
          // 먼저 서버에서 카테고리별 데이터 요청 시도
          data = await fetchProductsByCategory(activeCategory)
        } catch {
          // 서버 API 호출 실패 시 클라이언트에서 필터링
          data = allProducts.filter(product => 
            belongsToCategory(product.category, activeCategory)
          )
        }
      } else {
        // 서브카테고리 필터링
        try {
          // 형식에 맞춰 카테고리 문자열 구성
          const categoryPath = `${activeCategory}/${activeSubcategory}`
          data = await fetchProductsByCategory(categoryPath)
        } catch {
          // 서버 API 호출 실패 시 클라이언트에서 필터링
          data = allProducts.filter(product => {
            // 카테고리 문자열이 'main/sub' 또는 'main-sub' 형식인지 확인
            if (!product.category) return false
            
            const categoryMatch = product.category === `${activeCategory}/${activeSubcategory}` || 
                                  product.category === `${activeCategory}-${activeSubcategory}`
            
            return categoryMatch
          })
        }
      }
      
      // 백엔드에서 정렬이 제대로 작동하지 않는 경우를 대비해 클라이언트 측에서도 정렬 적용
      const sortedData = sortProducts(data, sortBy, sortDirection)
      setProducts(sortedData)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '상품을 불러오는데 실패했습니다.')
      setProducts([]) // 오류 시 빈 배열로 설정
      setLoading(false)
    }
  }, [activeCategory, activeSubcategory, sortBy, sortDirection, allProducts, belongsToCategory])

  useEffect(() => {
    // 카테고리나 정렬 조건이 변경되면 상품 목록 업데이트
    loadProducts()
  }, [activeCategory, activeSubcategory, sortBy, sortDirection, allProducts, loadProducts])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId)
    setActiveSubcategory("all") // 새 카테고리를 선택하면 서브카테고리 초기화
  }, [])

  const handleSubcategoryChange = useCallback((subcategoryId: string) => {
    setActiveSubcategory(subcategoryId)
  }, [])

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortBy)
  }, [])

  const toggleSortDirection = useCallback(() => {
    setSortDirection(prev => 
      prev === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    )
  }, [])

  const getSortIcon = useCallback(() => {
    if (sortBy === SortBy.NEWEST) {
      return sortDirection === SortDirection.DESC 
        ? <ArrowDown size={16} /> 
        : <ArrowUp size={16} />
    }
    
    if (sortBy === SortBy.PRICE || sortBy === SortBy.NAME) {
      return sortDirection === SortDirection.ASC 
        ? <ArrowUp size={16} /> 
        : <ArrowDown size={16} />
    }
    
    return <ArrowUpDown size={16} />
  }, [sortBy, sortDirection])

  // 현재 카테고리에 해당하는 카테고리 객체 가져오기
  const currentCategory = categories.find(cat => cat.id === activeCategory)
  const hasSubcategories = currentCategory && currentCategory.subcategories.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 스토어 헤더 */}
      <div className={styles.header}>
        <div className="container mx-auto px-4">
          <h1>Chill Haven 기프트샵</h1>
          <p>특별한 추억을 만들어 줄 Chill Haven의 프리미엄 상품들을 만나보세요.</p>
        </div>
      </div>

      {/* 상품 섹션 */}
      <div className={styles.storeSection}>
        <div className="container mx-auto px-4">
          {/* 브레드크럼 */}
          <div className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>홈</Link>
            <span className={styles.breadcrumbSeparator}><ChevronRight size={14} /></span>
            <Link href="/store" className={styles.breadcrumbLink}>기프트샵</Link>
            
            {activeCategory !== "all" && (
              <>
                <span className={styles.breadcrumbSeparator}><ChevronRight size={14} /></span>
                <span className={styles.breadcrumbCurrent}>
                  {categories.find(cat => cat.id === activeCategory)?.name}
                </span>
                
                {activeSubcategory !== "all" && (
                  <>
                    <span className={styles.breadcrumbSeparator}><ChevronRight size={14} /></span>
                    <span className={styles.breadcrumbCurrent}>
                      {currentCategory?.subcategories.find(sub => sub.id === activeSubcategory)?.name}
                    </span>
                  </>
                )}
              </>
            )}
          </div>

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
                        e.preventDefault();
                        handleCategoryChange(category.id);
                      }}
                    >
                      {category.name}
                    </a>
                    
                    {/* 서브카테고리 표시 */}
                    {category.subcategories.length > 0 && activeCategory === category.id && (
                      <ul className={styles.subcategoryList}>
                        <li className={styles.subcategoryItem}>
                          <a
                            href="#"
                            className={`${styles.subcategoryLink} ${activeSubcategory === "all" ? styles.activeSubcategory : ""}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSubcategoryChange("all");
                            }}
                          >
                            전체보기
                          </a>
                        </li>
                        
                        {category.subcategories.map((sub) => (
                          <li key={sub.id} className={styles.subcategoryItem}>
                            <a
                              href="#"
                              className={`${styles.subcategoryLink} ${activeSubcategory === sub.id ? styles.activeSubcategory : ""}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubcategoryChange(sub.id);
                              }}
                            >
                              {sub.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* 상품 목록 섹션 */}
            <div>
              {/* 정렬 옵션 */}
              <div className={styles.sortOptions}>
                <div className={styles.sortContainer}>
                  <select
                    className={styles.sortSelect}
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    className={styles.sortDirectionBtn}
                    onClick={toggleSortDirection}
                    title={sortDirection === SortDirection.ASC ? "오름차순" : "내림차순"}
                  >
                    {getSortIcon()}
                  </button>
                </div>
              </div>

              {/* 상품 그리드 */}
              {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 py-8 text-center">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <div className="text-gray-500 py-8 text-center">
                  상품이 없습니다.
                </div>
              ) : (
                <div className={styles.productGrid}>
                  {products.map((product) => (
                    <Link 
                      href={`/store/${product.itemIdx}`} 
                      key={product.itemIdx} 
                      className={styles.productCard}
                    >
                      <div className={styles.productImage}>
                        <Image
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.itemName}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className={styles.productContent}>
                        <div className={styles.productCategory}>
                          {formatCategory(product.category)}
                        </div>
                        <h3 className={styles.productName}>{product.itemName}</h3>
                        <div className={styles.productPrice}>
                          {new Intl.NumberFormat('ko-KR').format(product.price)}원
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

