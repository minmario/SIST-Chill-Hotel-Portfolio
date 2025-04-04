"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import styles from "@/app/store/store.module.css"

// 상품 데이터 - 스토어 페이지와 일치시킴
const products = [
  {
    id: 1,
    name: "호텔 시그니처 베개",
    price: 89000,
    description:
      "호텔에서 경험한 편안한 수면을 집에서도 느껴보세요. 최고급 소재로 제작된 시그니처 베개는 목과 어깨의 피로를 줄여주고 숙면을 도와줍니다.",
    features: ["100% 유기농 면 커버", "저자극성 소재", "인체공학적 디자인", "세탁기 사용 가능", "항균 처리"],
    category: "침구",
    subcategory: "베개",
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 2,
    name: "프리미엄 목욕 가운",
    price: 150000,
    description:
      "호텔의 럭셔리함을 집에서도 경험해보세요. 부드러운 터치감과 뛰어난 흡수력을 갖춘 프리미엄 목욕 가운으로 일상 속 작은 사치를 즐겨보세요.",
    features: ["100% 터키산 면", "고밀도 직조", "뛰어난 흡수력", "남녀공용 디자인", "세탁기 사용 가능"],
    category: "욕실용품",
    subcategory: "가운",
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 3,
    name: "아로마 디퓨저",
    price: 75000,
    description:
      "호텔의 시그니처 향기를 집에서도 경험해보세요. 천연 에센셜 오일을 사용한 아로마 디퓨저는 공간에 은은한 향기를 퍼뜨려 편안한 분위기를 만들어줍니다.",
    features: ["천연 에센셜 오일 사용", "최대 8시간 지속", "자동 전원 차단 기능", "LED 무드등 포함", "저소음 설계"],
    category: "홈데코",
    subcategory: "디퓨저",
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 4,
    name: "럭셔리 바스 타월 세트",
    price: 120000,
    description:
      "호텔급 럭셔리 타월 세트로 일상 속 작은 사치를 경험해보세요. 부드러운 터치감과 뛰어난 흡수력을 갖춘 프리미엄 타월입니다.",
    features: [
      "100% 이집트산 면",
      "고밀도 직조",
      "뛰어난 흡수력",
      "대형 타월 2장, 핸드 타월 2장 구성",
      "세탁기 사용 가능",
    ],
    category: "욕실용품",
    subcategory: "타월",
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 5,
    name: "시그니처 룸 스프레이",
    price: 65000,
    description:
      "호텔의 시그니처 향기를 담은 룸 스프레이로 공간에 고급스러운 향기를 더해보세요. 천연 성분으로 만들어져 안심하고 사용할 수 있습니다.",
    features: ["천연 에센셜 오일 함유", "알코올 프리 포뮬러", "지속력 강화", "100ml 용량", "재사용 가능한 유리 용기"],
    category: "홈데코",
    subcategory: "방향제",
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 6,
    name: "호텔 슬리퍼 세트",
    price: 45000,
    description:
      "호텔에서 느꼈던 편안함을 집에서도 경험해보세요. 부드러운 소재와 인체공학적 디자인으로 제작된 슬리퍼는 하루의 피로를 풀어줍니다.",
    features: ["메모리폼 쿠션", "논슬립 밑창", "통기성 소재", "남녀공용 디자인", "2켤레 세트"],
    category: "생활용품",
    subcategory: "슬리퍼",
    image: "/placeholder.svg?height=600&width=600",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 7,
    name: "럭스 시그니처 아로마 디퓨저",
    price: 58000,
    image: "/placeholder.svg?height=600&width=600",
    category: "signature",
    subcategory: "aroma",
    description:
      "럭스 호텔의 시그니처 향을 담은 프리미엄 디퓨저입니다. 은은한 우드와 시트러스 향이 조화롭게 어우러져 호텔의 고급스러운 분위기를 그대로 느낄 수 있습니다.",
    features: ["100% 천연 에센셜 오일", "최대 12주 지속", "친환경 리드 스틱", "200ml 용량", "고급 유리 용기"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 8,
    name: "럭스 바디 워시",
    price: 35000,
    image: "/placeholder.svg?height=600&width=600",
    category: "signature",
    subcategory: "bath",
    description:
      "럭스 호텔에서 직접 사용하는 프리미엄 바디 워시입니다. 자연에서 추출한 성분으로 만들어져 피부에 자극 없이 부드럽게 클렌징해주며, 호텔의 시그니처 향이 오래 지속됩니다.",
    features: ["천연 식물성 성분", "파라벤 무첨가", "pH 밸런스 조절", "300ml 용량", "재활용 가능 용기"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 9,
    name: "럭스 시그니처 베개",
    price: 120000,
    image: "/placeholder.svg?height=600&width=600",
    category: "signature",
    subcategory: "bedding",
    description:
      "럭스 호텔의 객실에서 사용되는 최고급 베개입니다. 100% 구스 다운 충전재를 사용하여 부드러운 감촉과 탁월한 지지력을 제공합니다.",
    features: ["100% 구스 다운 충전재", "고급 면 커버", "항균 처리", "알레르기 방지", "세탁 가능"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 10,
    name: "명상 캔들 세트",
    price: 45000,
    image: "/placeholder.svg?height=600&width=600",
    category: "wellness",
    subcategory: "meditation",
    description:
      "명상과 휴식을 위한 프리미엄 캔들 세트입니다. 라벤더, 유칼립투스, 샌달우드 향의 3가지 캔들로 구성되어 있으며, 각각 다른 효과를 제공합니다.",
    features: ["100% 소이 왁스", "천연 코튼 심지", "최대 50시간 지속", "3종 세트", "선물용 패키지"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 11,
    name: "럭스 수면 안대",
    price: 28000,
    image: "/placeholder.svg?height=600&width=600",
    category: "wellness",
    subcategory: "sleep",
    description:
      "완벽한 수면을 위한 프리미엄 실크 안대입니다. 100% 뽕나무 실크로 제작되어 피부에 자극이 없고 부드러운 착용감을 제공합니다.",
    features: ["100% 뽕나무 실크", "인체공학적 디자인", "조절 가능한 스트랩", "완벽한 빛 차단", "여행용 파우치 포함"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
  {
    id: 12,
    name: "에센셜 오일 컬렉션",
    price: 65000,
    image: "/placeholder.svg?height=600&width=600",
    category: "wellness",
    subcategory: "aromatherapy",
    description:
      "6가지 프리미엄 에센셜 오일로 구성된 컬렉션입니다. 라벤더, 유칼립투스, 페퍼민트, 티트리, 레몬그라스, 오렌지 오일이 포함되어 있어 다양한 아로마테라피 효과를 경험할 수 있습니다.",
    features: ["100% 천연 성분", "6종 세트", "각 10ml 용량", "다양한 용도", "선물용 우드 박스"],
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
  },
]

export default function ProductDetail() {
  const [mounted, setMounted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart() // useCart 훅을 여기로 이동, 조건부 반환 이전에 호출

  // 클라이언트 사이드에서만 실행되도록 처리
  useEffect(() => {
    setMounted(true)
  }, [])

  // 서버 사이드 렌더링 중에는 기본 UI만 표시
  if (!mounted) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">상품 정보 로딩 중...</h2>
        <p className="mb-6">잠시만 기다려주세요.</p>
      </div>
    )
  }

  const productId = Number(params.id)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h2>
        <p className="mb-6">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
        <Link href="/store" className="button button-primary">
          스토어로 돌아가기
        </Link>
      </div>
    )
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      category: product.category,
      subcategory: product.subcategory,
    })

    router.push("/cart")
  }

  return (
    <div className="container py-12">
      <Link href="/store" className={styles.backLink}>
        <ChevronLeft size={16} />
        스토어로 돌아가기
      </Link>

      <div className={styles.productDetail}>
        <div className={styles.productGallery}>
          <div className={styles.mainImage}>
            <Image
              src={product.images[activeImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover rounded-lg"
            />
          </div>
          <div className={styles.thumbnails}>
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${activeImage === index ? styles.activeThumbnail : ""}`}
                onClick={() => setActiveImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productInfo}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productPrice}>{product.price.toLocaleString()}원</p>
          <p className={styles.productDescription}>{product.description}</p>

          <div className={styles.productFeatures}>
            <h3 className={styles.featuresTitle}>제품 특징</h3>
            <ul className={styles.featuresList}>
              {product.features.map((feature, index) => (
                <li key={index} className={styles.featureItem}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.productActions}>
            <div className={styles.quantityControl}>
              <button onClick={decreaseQuantity} className={styles.quantityButton} disabled={quantity <= 1}>
                <Minus size={16} />
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button onClick={increaseQuantity} className={styles.quantityButton}>
                <Plus size={16} />
              </button>
            </div>

            <button onClick={handleAddToCart} className={styles.addToCartButton}>
              <ShoppingBag size={18} />
              장바구니에 담기
            </button>
          </div>

          <div className={styles.productMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>카테고리:</span>
              <span className={styles.metaValue}>{product.category}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>하위 카테고리:</span>
              <span className={styles.metaValue}>{product.subcategory}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

