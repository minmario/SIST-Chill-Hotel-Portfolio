"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log("상품 목록 로딩 시작")
        setLoading(true)
        setError(null) // 이전 오류 초기화
        
        // 카테고리가 선택된 경우 해당 카테고리 상품만 로드
        let data: Product[]
        
        try {
          // 정렬 옵션을 포함하여 API 호출
          if (activeCategory !== "all") {
            // 서브카테고리가 선택된 경우 카테고리/서브카테고리 형식으로 조합하여 API 호출
            if (activeSubcategory !== "all") {
              // 특정 서브카테고리 선택 - API로 직접 호출
              const categoryParam = `${activeCategory}-${activeSubcategory}`
              console.log(`조합된 카테고리 파라미터: ${categoryParam} (하이픈 형식)`)
              
              try {
                console.log(`서브카테고리 API 호출 시작 - 파라미터: ${categoryParam}, 정렬: ${sortBy}, ${sortDirection}`)
                data = await fetchProductsByCategory(categoryParam, sortBy, sortDirection)
                console.log(`서브카테고리 API 응답: ${data.length} 개 상품, 첫 번째 상품 카테고리: ${data.length > 0 ? data[0].category : '없음'}`)
              } catch (apiError) {
                console.error(`서브카테고리 API 오류:`, apiError)
                // 오류 발생 시 클라이언트 필터링으로 대체
                console.log(`전체 상품에서 클라이언트 필터링으로 대체`)
                data = allProducts.filter((product) => {
                  // 하이픈 형식과 슬래시 형식 모두 확인
                  const categoryMatch = product.category === categoryParam || 
                                      product.category === categoryParam.replace('-', '/');
                  if (categoryMatch && product.category) {
                    console.log(`일치하는 상품 발견: ${product.itemName}, 카테고리: ${product.category}`);
                  }
                  return categoryMatch;
                })
                console.log(`클라이언트 필터링 결과: ${data.length} 개 상품`)
              }
            } else {
              // 전체보기 선택 - 서버에서 접두어 검색으로 조회
              console.log(`${activeCategory} 카테고리 전체보기 API 호출 - 정렬: ${sortBy}, ${sortDirection}`)
              
              try {
                data = await fetchProductsByCategory(activeCategory, sortBy, sortDirection)
                console.log(`카테고리 전체보기 API 응답: ${data.length} 개 상품`)
                if (data.length > 0) {
                  console.log(`첫 번째 상품: ${data[0].itemName}, 카테고리: ${data[0].category}`)
                }
              } catch (apiError) {
                console.error(`카테고리 API 오류:`, apiError)
                // 오류 발생 시 클라이언트 필터링으로 대체
                console.log(`전체 상품에서 클라이언트 필터링으로 대체`)
                data = allProducts.filter((product) => {
                  const categoryMatch = product.category === activeCategory || 
                                      product.category.startsWith(`${activeCategory}-`) || 
                                      product.category.startsWith(`${activeCategory}/`);
                  if (categoryMatch && product.category) {
                    console.log(`일치하는 상품 발견: ${product.itemName}, 카테고리: ${product.category}`);
                  }
                  return categoryMatch;
                })
                console.log(`클라이언트 필터링 결과: ${data.length} 개 상품`)
              }
            }
          } else {
            data = await fetchProducts(sortBy, sortDirection)
          }
          
          console.log("받은 상품 데이터:", data ? data.length : 0, "개")
          
          // 백엔드에서 정렬이 제대로 작동하지 않는 경우를 대비해 클라이언트 측에서도 정렬 적용
          const sortedData = sortProducts(data, sortBy, sortDirection)
          setProducts(sortedData)
        } catch (err) {
          console.error("API 호출 오류:", err)
          // API 오류 발생 시 빈 배열 설정
          setProducts([])
          
          if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('상품을 불러오는데 실패했습니다.')
          }
        }
        
        setLoading(false)
      } catch (err) {
        console.error("상품 로딩 오류:", err)
        setError(err instanceof Error ? err.message : '상품을 불러오는데 실패했습니다.')
        setProducts([]) // 오류 시 빈 배열로 설정
        setLoading(false)
      }
    }

    // allProducts가 로드된 후 카테고리 필터링 수행
    if (allProducts.length > 0 || activeCategory === "all" || activeSubcategory !== "all") {
      loadProducts()
    }
  }, [activeCategory, activeSubcategory, sortBy, sortDirection, allProducts])

  // 카테고리에 속하는지 확인하는 함수
  const belongsToCategory = (productCategory: string, mainCategory: string): boolean => {
    if (!productCategory) return false
    
    // 정확히 일치하는 경우
    if (productCategory === mainCategory) return true
    
    // 하이픈(-) 또는 슬래시(/) 형식으로 시작하는 경우
    if (productCategory.startsWith(`${mainCategory}-`) || 
        productCategory.startsWith(`${mainCategory}/`)) {
      return true
    }
    
    // 문자열 자체에 카테고리가 포함된 경우 (DB 데이터 구조에 따라 필요 시)
    if (productCategory.includes(mainCategory)) {
      // 추가 검증 - 단순 부분 문자열 포함이 아닌 실제 카테고리명과 일치하는지
      const possibleCategories = ['signature', 'wellness', 'eco', 'food', 'room', 'memory']
      // 현재 선택된 카테고리가 아닌 다른 메인 카테고리명이 포함된 경우 제외
      for (const cat of possibleCategories) {
        if (cat !== mainCategory && productCategory.includes(cat)) {
          return false
        }
      }
      return true
    }
    
    return false
  }

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "all") {
      return true // 전체 상품 선택 시 모든 상품 표시
    }
    
    if (activeSubcategory === "all") {
      // 전체보기 선택 시 해당 메인 카테고리의 모든 상품 표시
      return belongsToCategory(product.category, activeCategory)
    }
    
    // 서브카테고리까지 선택된 경우
    // 하이픈(-) 또는 슬래시(/) 형식 모두 확인
    return product.category === `${activeCategory}-${activeSubcategory}` || 
           product.category === `${activeCategory}/${activeSubcategory}`
  })

  const currentCategory = categories.find((cat) => cat.id === activeCategory)

  // 정렬 방향 토글 함수
  const toggleSortDirection = () => {
    setSortDirection(
      sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    )
  }

  // 정렬 기준 변경 함수
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortBy)
  }

  // 정렬 아이콘 선택 함수
  const getSortIcon = () => {
    if (sortDirection === SortDirection.ASC) {
      return <ArrowUp size={16} />
    } else {
      return <ArrowDown size={16} />
    }
  }

  useEffect(() => {
    // 카테고리가 변경되면 서브카테고리를 'all'로 초기화
    setActiveSubcategory("all")
  }, [activeCategory])

  // 카테고리 표시명 변환 함수
  const formatCategory = (category: string | undefined): string => {
    if (!category) return '기타'
    
    // 하이픈(-) 또는 슬래시(/)로 구분된 카테고리 처리
    const separator = category.includes('-') ? '-' : '/'
    const parts = category.split(separator)
    
    if (parts.length === 1) return category
    
    // 서브카테고리만 표시 (마지막 부분)
    return parts[parts.length - 1]
  }

  if (loading && products.length === 0) return <div className="container mx-auto p-4">상품 로딩 중...</div>
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
                    aria-label={sortDirection === SortDirection.ASC ? "오름차순 정렬" : "내림차순 정렬"}
                  >
                    {getSortIcon()}
                  </button>
                </div>
              </div>

              {/* 오류 메시지 표시 */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                  <p>{error}</p>
                </div>
              )}

              <div className={styles.productGrid}>
                {filteredProducts.length > 0 ? (
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
                          {formatCategory(product.category)}
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

