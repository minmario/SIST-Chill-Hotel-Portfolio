"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import styles from "@/app/store/store.module.css"

// 상품 데이터 (실제로는 API에서 가져올 것)
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
]

export default function ProductDetail() {
  const [mounted, setMounted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const params = useParams()
  const router = useRouter()

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

  const { addToCart } = useCart()

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

