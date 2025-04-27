"use client"

import * as React from "react"

import { useState, useEffect, useRef, createRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Plus, Pencil, Trash2, Search, CheckSquare, Square, AlertCircle, X, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { createPortal } from "react-dom"

// 물품 타입 정의
type Item = {
  itemIdx: number
  price: number
  stockQuantity: number
  createdAt: string
  updatedAt: string
  category: string
  itemName: string
  description: string
  imageUrl: string
}

// 카테고리 목록
const categories = [
  "시그니처 컬렉션",
  "힐링 & 웰니스 컬렉션",
  "에코 & 지속가능한 라이프스타일",
  "휴식을 위한 식음료 제품",
  "객실 등급별 맞춤 컬렉션",
  "메모리 & 컬렉터블 아이템"
]

// 카테고리 ID 매핑
const categoryIdMap: Record<string, string> = {
  "시그니처 컬렉션": "signature",
  "힐링 & 웰니스 컬렉션": "wellness",
  "에코 & 지속가능한 라이프스타일": "eco",
  "휴식을 위한 식음료 제품": "food",
  "객실 등급별 맞춤 컬렉션": "room",
  "메모리 & 컬렉터블 아이템": "memory"
}

// 서브카테고리 타입 정의
type Subcategory = { id: string; name: string }[];

// 서브카테고리 매핑
const subcategories: Record<string, Subcategory> = {
  "signature": [
    { id: "aroma", name: "아로마 & 디퓨저" },
    { id: "bath", name: "목욕 제품" },
    { id: "bedding", name: "침구 & 가운" }
  ],
  "wellness": [
    { id: "meditation", name: "명상 & 요가" },
    { id: "sleep", name: "수면 & 릴렉스" },
    { id: "aromatherapy", name: "아로마테라피" }
  ],
  "eco": [
    { id: "eco-living", name: "친환경 생활용품" },
    { id: "organic", name: "유기농 퍼스널 케어" },
    { id: "travel", name: "지속가능한 여행용품" }
  ],
  "food": [
    { id: "tea", name: "차 & 티웨어" },
    { id: "organic-food", name: "유기농 식품" },
    { id: "wine", name: "와인 & 음료" }
  ],
  "room": [
    { id: "comfort", name: "컴포트 & 하모니 컬렉션" },
    { id: "family", name: "패밀리 & 레이크 컬렉션" },
    { id: "ultimate", name: "얼티메이트 컬렉션" }
  ],
  "memory": [
    { id: "photo", name: "포토 & 아트" },
    { id: "miniature", name: "미니어처 & 피규어" },
    { id: "seasonal", name: "시즌 & 한정판 컬렉션" }
  ]
}

// 모달 컴포넌트
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  // 모달이 열리면 body에 overflow hidden 적용, 닫히면 제거
  useEffect(() => {
    // 서버 사이드 렌더링 중이면 동작하지 않음
    if (typeof window === 'undefined') return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // 모바일 터치 방지
      // 스크롤바 너비만큼 padding-right 추가하여 레이아웃 이동 방지
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.paddingRight = '';
    }
    
    // 컴포넌트 언마운트 시 원래대로 복원
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      {/* 모달 컨텐츠 */}
      <div className="fixed z-[101] bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-4 overflow-y-auto">{children}</div>

        {/* 푸터 */}
        {footer && <div className="p-4 border-t flex justify-end gap-2 mt-auto">{footer}</div>}
      </div>
    </div>
  )
}

// Custom Select 스타일 컴포넌트 - 메인 컴포넌트 위에 배치
function CustomSelectContent({ children, ...props }: React.ComponentPropsWithoutRef<typeof SelectContent>) {
  return (
    <SelectContent
      {...props}
      className="fixed z-[1000] bg-white border border-gray-200 shadow-lg rounded-md w-[var(--radix-select-trigger-width)]"
      position="popper"
      sideOffset={5}
    >
      {children}
    </SelectContent>
  );
}

// API URL - 백엔드 컨트롤러의 경로와 일치시킴
const API_URL = "/api/v1/admin/gift-shop"

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string>("itemIdx") // 기본 정렬 필드를 itemIdx로 변경
  const [sortDirection, setSortDirection] = useState<string>("desc") // 내림차순 정렬

  // 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // 선택된 항목 관리
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false)

  // 새 물품 또는 편집할 물품 상태
  const [currentItem, setCurrentItem] = useState<Partial<Item>>({
    itemName: "",
    price: 0,
    stockQuantity: 0,
    createdAt: "",
    updatedAt: "",
    category: "",
    description: "",
    imageUrl: "",
  })

  // 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // 포털 컨테이너 refs
  const portalRef = useRef<HTMLDivElement>(null)

  // 파일 업로드 상태
  const [uploadLoading, setUploadLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 필터링 및 정렬된 아이템 목록
  const filteredItems = items.filter((item) => {
    // 검색어 필터링
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 카테고리 필터링
    const matchesCategory = !selectedCategory || 
      (item.category && item.category.startsWith(selectedCategory));
    
    // 서브카테고리 필터링
    const matchesSubcategory = !selectedSubcategory || 
      (item.category && (
        item.category === `${selectedCategory}-${selectedSubcategory}` || 
        item.category === `${selectedCategory}/${selectedSubcategory}`
      ));
    
    return matchesSearch && matchesCategory && (selectedSubcategory ? matchesSubcategory : true);
  }).sort((a, b) => {
    // 정렬 로직
    let valueA: any, valueB: any;
    
    switch(sortField) {
      case "price":
        valueA = a.price;
        valueB = b.price;
        break;
      case "stockQuantity":
        valueA = a.stockQuantity;
        valueB = b.stockQuantity;
        break;
      case "itemName":
        valueA = a.itemName;
        valueB = b.itemName;
        break;
      case "itemIdx":
        valueA = a.itemIdx;
        valueB = b.itemIdx;
        break;
      case "createdAt":
      default:
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
    }
    
    return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
  });

  // 현재 페이지에 표시할 아이템
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 초기 데이터 로드
  useEffect(() => {
    fetchItems()
  }, [])

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSubcategory, sortField, sortDirection]);

  // 아이템 목록 가져오기
  const fetchItems = async () => {
    setLoading(true);
    try {
      console.log('API 호출 시작:', API_URL);
      
      // API 요청 시 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
      
      const token = localStorage.getItem("accessToken");
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // 쿠키를 포함하여 요청
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // 타임아웃 해제
      
      console.log('API 응답 상태:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        throw new Error(`API 오류 (${response.status}): ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('JSON이 아닌 응답:', contentType);
        const text = await response.text();
        console.warn('응답 내용:', text);
        throw new Error('서버가 JSON이 아닌 응답을 반환했습니다');
      }
      
      const data = await response.json();
      console.log('API 응답 데이터 타입:', typeof data, Array.isArray(data));
      console.log('API 응답 데이터 샘플:', Array.isArray(data) && data.length > 0 ? data[0] : data);
      
      // 데이터 유효성 검사
      if (!Array.isArray(data)) {
        console.error('서버 응답이 배열 형식이 아닙니다:', data);
        toast.error('서버 응답 형식이 올바르지 않습니다');
        setItems([]);
        return;
      }
      
      // 데이터 필드 검사 및 변환
      const validItems = data.filter(item => {
        if (!item || typeof item !== 'object') return false;
        if (item.itemIdx === undefined) return false;
        
        return true;
      });
      
      console.log('유효한 아이템 수:', validItems.length);
      setItems(validItems);
      
      if (validItems.length === 0 && data.length > 0) {
        console.warn('API에서 데이터를 받았지만 유효한 아이템이 없습니다');
        toast.warning('데이터 형식이 올바르지 않습니다');
      }
      
    } catch (error: unknown) {
      console.error('아이템 가져오기 오류:', error);
      let errorMessage = '아이템을 불러오는데 실패했습니다';
      
      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = '서버 응답 시간이 초과되었습니다';
      } else if (error instanceof TypeError && (error as TypeError).message.includes('Failed to fetch')) {
        errorMessage = '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      }
      
      toast.error(errorMessage);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // 새로고침 핸들러
  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchItems()
      // 검색어와 카테고리 필터 초기화
      setSearchTerm("")
      setSelectedCategory(null)
      setSelectedSubcategory(null)
      // 선택된 항목 초기화
      setSelectedItems([])
      toast.success('아이템 목록을 새로고침했습니다')
    } catch (error: unknown) {
      console.error('Error refreshing items:', error)
      toast.error('새로고침에 실패했습니다')
    } finally {
      setRefreshing(false)
    }
  }

  // 필수 입력 필드의 오류 상태 관리
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 필수 필드 검증 함수
  const validateRequiredFields = () => {
    const newErrors: Record<string, string> = {}
    
    // 필수 필드 목록과 오류 메시지
    const requiredFields: Record<string, string> = {
      itemName: "상품명을 입력해주세요",
      price: "가격을 입력해주세요",
      stockQuantity: "재고 수량을 입력해주세요",
    }
    
    // 각 필수 필드 검증
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!currentItem[field as keyof Item]) {
        newErrors[field] = message
      } else if (field === "price" && (currentItem.price as number) <= 0) {
        newErrors[field] = "가격은 0보다 커야 합니다"
      } else if (field === "stockQuantity" && (currentItem.stockQuantity as number) < 0) {
        newErrors[field] = "재고 수량은 0 이상이어야 합니다"
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // 오류가 없으면 true 반환
  }

  // 입력 필드 변경 핸들러 - 오류 상태도 함께 관리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // 오류 상태 초기화
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }

    // 숫자 필드 처리
    if (name === "price" || name === "stockQuantity") {
      setCurrentItem({
        ...currentItem,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setCurrentItem({
        ...currentItem,
        [name]: value,
      })
    }
  }

  // 물품 추가 핸들러
  const handleAddItem = async () => {
    // 필수 필드 검증
    if (!validateRequiredFields()) {
      toast.error('필수 입력 항목을 모두 작성해주세요')
      return
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // 쿠키를 포함하여 요청
        body: JSON.stringify({
          itemName: currentItem.itemName,
          description: currentItem.description,
          price: currentItem.price,
          stockQuantity: currentItem.stockQuantity,
          category: currentItem.category,
          imageUrl: currentItem.imageUrl,
        }),
      })

      if (response.ok) {
        // 추가 후 전체 상품 목록 다시 불러오기
        await fetchItems()
        setIsAddModalOpen(false)
        toast.success('상품이 추가되었습니다')
      } else {
        toast.error('상품 추가에 실패했습니다')
      }
    } catch (error: unknown) {
      console.error('Error adding item:', error)
      if (error instanceof Error) {
        toast.error(`상품 추가에 실패했습니다: ${error.message}`)
      } else {
        toast.error('상품 추가에 실패했습니다')
      }
    }
  }

  // 물품 편집 핸들러
  const handleEditItem = async () => {
    // 필수 필드 검증
    if (!validateRequiredFields()) {
      toast.error('필수 입력 항목을 모두 작성해주세요')
      return
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/${currentItem.itemIdx}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // 쿠키를 포함하여 요청
        body: JSON.stringify({
          itemName: currentItem.itemName,
          description: currentItem.description,
          price: currentItem.price,
          stockQuantity: currentItem.stockQuantity,
          category: currentItem.category,
          imageUrl: currentItem.imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('상품 수정에 실패했습니다')
      }

      // 수정 후 전체 상품 목록 다시 불러오기
      await fetchItems()
      setIsEditModalOpen(false)
      toast.success('상품이 수정되었습니다')
    } catch (error: unknown) {
      console.error('Error updating item:', error)
      if (error instanceof Error) {
        toast.error(`상품 수정에 실패했습니다: ${error.message}`)
      } else {
        toast.error('상품 수정에 실패했습니다')
      }
    }
  }

  // 물품 삭제 핸들러
  const handleDeleteItem = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/${currentItem.itemIdx}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // 쿠키를 포함하여 요청
      })

      if (!response.ok) {
        // 응답 코드에 따른 다른 메시지 표시
        if (response.status === 409) {
          throw new Error('이 상품은 주문 내역에 포함되어 있어 삭제할 수 없습니다.');
        } else {
          throw new Error('상품 삭제에 실패했습니다');
        }
      }

      const updatedItems = items.filter((item) => item.itemIdx !== currentItem.itemIdx)
    setItems(updatedItems)
    setIsDeleteModalOpen(false)
      toast.success('상품이 삭제되었습니다')
    } catch (error: unknown) {
      console.error('Error deleting item:', error)
      if (error instanceof Error) {
        toast.error(error.message || '상품 삭제에 실패했습니다')
      } else {
        toast.error('상품 삭제에 실패했습니다')
      }
    }
  }

  // 선택된 물품 일괄 삭제 핸들러
  const handleBulkDeleteItems = async () => {
    try {
      // 여러 ID를 쿼리 파라미터로 전달
      const queryParams = new URLSearchParams();
      selectedItems.forEach(id => queryParams.append('itemIds', id.toString()));
      
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/bulk?${queryParams.toString()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include', // 쿠키를 포함하여 요청
      });

      if (!response.ok) {
        throw new Error('일괄 삭제에 실패했습니다');
      }

      // 삭제 후 목록 다시 불러오기
      await fetchItems();
    setSelectedItems([])
    setIsBulkDeleteModalOpen(false)
      toast.success('선택한 상품이 삭제되었습니다')
    } catch (error: unknown) {
      console.error('Error bulk deleting items:', error);
      const errorMsg = error instanceof Error ? error.message : '일괄 삭제에 실패했습니다';
      toast.error(errorMsg);
    }
  }

  // 편집 모달 열기
  const openEditModal = (item: Item) => {
    // 깊은 복사를 통해 모든 속성값을 새로운 객체로 복사
    setCurrentItem({
      ...item,
      imageUrl: item.imageUrl || "", // 이미지 URL이 없을 경우 빈 문자열로 처리
    })
    // 오류 상태 초기화
    setErrors({})
    setIsEditModalOpen(true)
  }

  // 삭제 모달 열기
  const openDeleteModal = (item: Item) => {
    setCurrentItem(item)
    setIsDeleteModalOpen(true)
  }

  // 셀렉트 변경 핸들러
  const handleSelectChange = (name: string, value: string) => {
    // 오류 상태 초기화
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
    
    setCurrentItem({
      ...currentItem,
      [name]: value,
    })
  }

  // 항목 선택 토글
  const toggleItemSelection = (itemIdx: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemIdx) ? prev.filter((id) => id !== itemIdx) : [...prev, itemIdx]
    )
  }

  // 전체 선택 토글
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.itemIdx))
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
    const date = new Date(dateString)
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    } catch (error) {
      return '날짜 형식 오류'
    }
  }

  // 추가 모달 열기
  const handleOpenAddModal = () => {
    // 모든 필드를 초기화
    setCurrentItem({
      itemName: "",
      price: 0,
      stockQuantity: 0,
      createdAt: "",
      updatedAt: "",
      category: "",
      description: "",
      imageUrl: "", // 이미지 URL도 명시적으로 초기화
    })
    // 오류 상태도 초기화
    setErrors({})
    setIsAddModalOpen(true)
  }

  // 카테고리 변경 핸들러
  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryIdMap[value] || null);
    }
    setSelectedSubcategory(null);
  };
  
  // 서브카테고리 변경 핸들러
  const handleSubcategoryChange = (subcategoryId: string) => {
    // "none"일 경우 서브카테고리 필터링을 해제합니다
    setSelectedSubcategory(subcategoryId === "none" ? null : subcategoryId);
  };
  
  // 정렬 필드 변경 핸들러
  const handleSortFieldChange = (field: string) => {
    // 같은 필드 클릭 시 방향 전환
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // 새 필드 선택 시 기본 내림차순
    }
  };

  // 정렬 아이콘 렌더링
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  // 포털 컨테이너 요소 생성 및 스타일 적용
  useEffect(() => {
    // 서버 사이드 렌더링일 경우 실행하지 않음
    if (typeof window === 'undefined') return;
    
    // 기존 포털 컨테이너가 있다면 제거
    const existingContainer = document.getElementById('select-portal-container')
    if (existingContainer) {
      existingContainer.remove()
    }
    
    // 새 포털 컨테이너 생성
    const portalContainer = document.createElement('div')
    portalContainer.id = 'select-portal-container'
    portalContainer.style.position = 'fixed'
    portalContainer.style.top = '0'
    portalContainer.style.left = '0'
    portalContainer.style.width = '100%'
    portalContainer.style.height = '100%'
    portalContainer.style.zIndex = '9999'
    portalContainer.style.pointerEvents = 'none' // 포인터 이벤트 비활성화로 다른 콘텐츠 클릭 가능
    document.body.appendChild(portalContainer)
    
    // 컴포넌트 언마운트 시 제거
    return () => {
      portalContainer.remove()
    }
  }, [])

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    // 파일 크기 검증 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('10MB 이하의 이미지만 업로드할 수 있습니다.')
      return
    }

    setUploadLoading(true)
    
    try {
      // 파일 업로드를 위한 FormData 생성
      const formData = new FormData()
      formData.append('file', file)
      
      const token = localStorage.getItem("accessToken");
      const response = await fetch('/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다')
      }
      
      const imageUrl = await response.text()
      handleSelectChange('imageUrl', imageUrl)
      toast.success('이미지가 업로드되었습니다')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('이미지 업로드에 실패했습니다')
    } finally {
      setUploadLoading(false)
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* 포털을 위한 컨테이너 */}
      <div id="portal-root" ref={portalRef} />
    
      <h1 className="text-2xl font-bold mb-4">기프트샵 관리</h1>
      
      {/* 검색 및 필터 섹션 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="상품명 또는 설명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <div className="relative">
              <Select 
                value={
                  selectedCategory 
                  ? Object.entries(categoryIdMap)
                      .find(([_, id]) => id === selectedCategory)?.[0] || "all" 
                  : "all"
                }
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="전체 카테고리" />
                </SelectTrigger>
                <CustomSelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                    {category}
                    </SelectItem>
                ))}
                </CustomSelectContent>
              </Select>
            </div>
            
            {selectedCategory && subcategories[selectedCategory] && (
              <div className="relative">
                <Select 
                  value={
                    selectedSubcategory && selectedSubcategory !== "none"
                      ? selectedSubcategory
                      : "none"
                  }
                  onValueChange={handleSubcategoryChange}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="서브카테고리">
                      {selectedSubcategory === "none" ? "전체" : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <CustomSelectContent>
                    <SelectItem value="none">전체</SelectItem>
                  {subcategories[selectedCategory].map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id || "no-value"}>
                      {subcategory.name}
                      </SelectItem>
                  ))}
                  </CustomSelectContent>
                </Select>
              </div>
            )}
            
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={18} className={`${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <Button variant="default" onClick={handleOpenAddModal}>
              <Plus size={18} className="mr-1" /> 상품 추가
            </Button>
            
            {selectedItems.length > 0 && (
              <Button variant="destructive" onClick={() => setIsBulkDeleteModalOpen(true)}>
                <Trash2 size={18} className="mr-1" /> 선택 삭제 ({selectedItems.length})
              </Button>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredItems.length}개 상품 표시 중 (전체 {items.length}개)
          </div>
        </div>
      </div>
      
      {/* 물품 테이블 */}
      <div className="relative bg-white rounded-lg shadow-md" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
        <div className="min-w-full w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div style={{ width: '100%', minWidth: '100%' }}>
              <Table className="table-fixed w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <div className="flex justify-center items-center" onClick={toggleSelectAll}>
                        {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? (
                          <CheckSquare size={18} className="cursor-pointer text-primary" />
                        ) : (
                          <Square size={18} className="cursor-pointer" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[80px]">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSortFieldChange("itemIdx")}>
                        ID {renderSortIcon("itemIdx")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[25%]">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSortFieldChange("itemName")}>
                        상품명 {renderSortIcon("itemName")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[15%]">카테고리</TableHead>
                    <TableHead className="w-[10%] text-right">
                      <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortFieldChange("price")}>
                        가격 {renderSortIcon("price")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] text-right">
                      <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSortFieldChange("stockQuantity")}>
                        재고 {renderSortIcon("stockQuantity")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[15%]">
                      <div className="flex items-center cursor-pointer" onClick={() => handleSortFieldChange("createdAt")}>
                        생성일 {renderSortIcon("createdAt")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[15%]">수정일</TableHead>
                    <TableHead className="w-[100px] text-center">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // 로딩 스켈레톤
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell><Skeleton className="h-5 w-5 rounded-sm mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-full max-w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 mx-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        {items.length === 0 ? (
                          <div className="flex flex-col items-center justify-center">
                            <Package size={32} className="text-gray-300 mb-2" />
                            <p className="text-gray-500">등록된 상품이 없습니다. 새 상품을 추가해주세요.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle size={32} className="text-gray-300 mb-2" />
                            <p className="text-gray-500">검색 조건에 맞는 상품이 없습니다.</p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item) => (
                      <TableRow key={item.itemIdx}>
                        <TableCell>
                          <div
                            className="flex justify-center items-center"
                            onClick={() => toggleItemSelection(item.itemIdx)}
                          >
                            {selectedItems.includes(item.itemIdx) ? (
                              <CheckSquare size={18} className="cursor-pointer text-primary" />
                            ) : (
                              <Square size={18} className="cursor-pointer" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.itemIdx}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={item.itemName}>
                            {item.itemName}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 max-w-[200px] truncate" title={item.description}>
                              {item.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{item.category || "-"}</TableCell>
                        <TableCell className="text-right">{item.price.toLocaleString()}원</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.stockQuantity <= 5
                                ? "bg-red-100 text-red-800"
                                : item.stockQuantity <= 20
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.stockQuantity}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell>{formatDate(item.updatedAt)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditModal(item)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => openDeleteModal(item)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* 페이지네이션 추가 */}
        {!loading && filteredItems.length > 0 && (
          <div className="px-4 py-2 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* 상품 추가 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setErrors({})
        }}
        title="상품 추가"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false)
              setErrors({})
            }}>
              취소
            </Button>
            <Button onClick={handleAddItem}>추가</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* 필수 입력 항목 경고 메시지 */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    필수 입력 정보가 누락되었습니다
                  </h3>
                  <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="itemName" className="flex items-center">
              상품명 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="itemName"
              name="itemName"
              value={currentItem.itemName || ""}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요"
              required
              className={errors.itemName ? "border-red-500" : ""}
            />
            {errors.itemName && (
              <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="category">카테고리</Label>
            <div className="relative">
              <Select 
                value={currentItem.category?.split('-')[0] || currentItem.category?.split('/')[0] || "none"} 
                onValueChange={(value) => {
                  if (value === "none") {
                    handleSelectChange("category", "");
                  } else {
                    // 서브카테고리가 선택되어 있을 경우, 카테고리와 함께 저장
                    // 아니면 카테고리만 저장
                    const subcatValue = currentItem.category?.split(/[-\/]/)[1] || "";
                    handleSelectChange("category", subcatValue ? `${value}-${subcatValue}` : value);
                  }
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <CustomSelectContent>
                  <SelectItem value="none">카테고리 선택</SelectItem>
                  {Object.entries(categoryIdMap).map(([name, id]) => (
                    id !== "all" && <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </CustomSelectContent>
              </Select>
            </div>
          </div>
          
          {/* 서브카테고리 선택 */}
          {currentItem.category && currentItem.category !== "none" && (
            <div>
              <Label htmlFor="subcategory">서브카테고리</Label>
              <div className="relative">
                <Select 
                  value={currentItem.category?.split(/[-\/]/)[1] || "none"} 
                  onValueChange={(subcatValue) => {
                    const mainCat = currentItem.category?.split(/[-\/]/)[0] || "";
                    if (subcatValue === "none") {
                      handleSelectChange("category", mainCat);
                    } else {
                      handleSelectChange("category", `${mainCat}-${subcatValue}`);
                    }
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="서브카테고리 선택" />
                  </SelectTrigger>
                  <CustomSelectContent>
                    <SelectItem value="none">서브카테고리 선택</SelectItem>
                    {currentItem.category && 
                      subcategories[currentItem.category.split(/[-\/]/)[0]] && 
                      subcategories[currentItem.category.split(/[-\/]/)[0]].map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id || "no-value"}>
                          {subcategory.name}
                        </SelectItem>
                      ))
                    }
                  </CustomSelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="flex items-center">
                가격 (원) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                value={currentItem.price || 0}
                onChange={handleInputChange}
                required
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <Label htmlFor="stockQuantity" className="flex items-center">
                재고 수량 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                value={currentItem.stockQuantity || 0}
                onChange={handleInputChange}
                required
                className={errors.stockQuantity ? "border-red-500" : ""}
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              value={currentItem.description || ""}
              onChange={handleInputChange}
              placeholder="상품 설명을 입력하세요"
              rows={3}
            />
          </div>

          {/* 이미지 URL 필드 */}
          <div>
            <Label htmlFor="imageUrl">상품 이미지</Label>
            <div className="space-y-2">
              {currentItem.imageUrl ? (
                <div className="relative w-full">
                  <img 
                    src={currentItem.imageUrl} 
                    alt="상품 이미지 미리보기" 
                    className="h-40 object-contain border rounded-md p-2 bg-gray-50 w-full"
                  />
                  <Button
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white rounded-full h-6 w-6"
                    onClick={() => handleSelectChange('imageUrl', '')}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={currentItem.imageUrl || ""}
                    onChange={handleInputChange}
                    placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="imageUpload"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <>
                          <RefreshCw size={16} className="mr-1 animate-spin" />
                          업로드 중...
                        </>
                      ) : "파일 업로드"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 상품 편집 모달 */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setErrors({})
        }}
        title="상품 편집"
        footer={
          <>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false)
              setErrors({})
            }}>
              취소
            </Button>
            <Button onClick={handleEditItem}>저장</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* 필수 입력 항목 경고 메시지 */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    필수 입력 정보가 누락되었습니다
                  </h3>
                  <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
                    {Object.entries(errors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="edit-itemName" className="flex items-center">
              상품명 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="edit-itemName"
              name="itemName"
              value={currentItem.itemName || ""}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요"
              required
              className={errors.itemName ? "border-red-500" : ""}
            />
            {errors.itemName && (
              <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="edit-category">카테고리</Label>
            <div className="relative">
              <Select 
                value={currentItem.category?.split('-')[0] || currentItem.category?.split('/')[0] || "none"} 
                onValueChange={(value) => {
                  if (value === "none") {
                    handleSelectChange("category", "");
                  } else {
                    // 서브카테고리가 선택되어 있을 경우, 카테고리와 함께 저장
                    // 아니면 카테고리만 저장
                    const subcatValue = currentItem.category?.split(/[-\/]/)[1] || "";
                    handleSelectChange("category", subcatValue ? `${value}-${subcatValue}` : value);
                  }
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <CustomSelectContent>
                  <SelectItem value="none">카테고리 선택</SelectItem>
                  {Object.entries(categoryIdMap).map(([name, id]) => (
                    id !== "all" && <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </CustomSelectContent>
              </Select>
            </div>
          </div>
          
          {/* 서브카테고리 선택 */}
          {currentItem.category && currentItem.category !== "none" && (
            <div>
              <Label htmlFor="edit-subcategory">서브카테고리</Label>
              <div className="relative">
                <Select 
                  value={currentItem.category?.split(/[-\/]/)[1] || "none"} 
                  onValueChange={(subcatValue) => {
                    const mainCat = currentItem.category?.split(/[-\/]/)[0] || "";
                    if (subcatValue === "none") {
                      handleSelectChange("category", mainCat);
                    } else {
                      handleSelectChange("category", `${mainCat}-${subcatValue}`);
                    }
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="서브카테고리 선택" />
                  </SelectTrigger>
                  <CustomSelectContent>
                    <SelectItem value="none">서브카테고리 선택</SelectItem>
                    {currentItem.category && 
                      subcategories[currentItem.category.split(/[-\/]/)[0]] && 
                      subcategories[currentItem.category.split(/[-\/]/)[0]].map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id || "no-value"}>
                          {subcategory.name}
                        </SelectItem>
                      ))
                    }
                  </CustomSelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-price" className="flex items-center">
                가격 (원) <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                min="0"
                value={currentItem.price || 0}
                onChange={handleInputChange}
                required
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-stockQuantity" className="flex items-center">
                재고 수량 <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="edit-stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                value={currentItem.stockQuantity || 0}
                onChange={handleInputChange}
                required
                className={errors.stockQuantity ? "border-red-500" : ""}
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-xs mt-1">{errors.stockQuantity}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="edit-description">설명</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={currentItem.description || ""}
              onChange={handleInputChange}
              placeholder="상품 설명을 입력하세요"
              rows={3}
            />
          </div>
          
          {/* 이미지 URL 필드 */}
          <div>
            <Label htmlFor="edit-imageUrl">상품 이미지</Label>
            <div className="space-y-2">
              {currentItem.imageUrl ? (
                <div className="relative w-full">
                  <img 
                    src={currentItem.imageUrl} 
                    alt="상품 이미지 미리보기" 
                    className="h-40 object-contain border rounded-md p-2 bg-gray-50 w-full"
                  />
                  <Button
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white rounded-full h-6 w-6"
                    onClick={() => handleSelectChange('imageUrl', '')}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Input
                    id="edit-imageUrl"
                    name="imageUrl"
                    value={currentItem.imageUrl || ""}
                    onChange={handleInputChange}
                    placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id="edit-imageUpload"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <>
                          <RefreshCw size={16} className="mr-1 animate-spin" />
                          업로드 중...
                        </>
                      ) : "파일 업로드"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* 상품 삭제 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="상품 삭제"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              삭제
            </Button>
          </>
        }
      >
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">정말 삭제하시겠습니까?</h3>
          <p className="text-sm text-gray-500 mt-2">
            상품 <strong>{currentItem.itemName}</strong>을(를) 삭제하시면 복구할 수 없습니다.
          </p>
        </div>
      </Modal>

      {/* 일괄 삭제 모달 */}
      <Modal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        title="선택 상품 일괄 삭제"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsBulkDeleteModalOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleBulkDeleteItems}>
              일괄 삭제
            </Button>
          </>
        }
      >
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium">선택한 {selectedItems.length}개 상품을 정말 삭제하시겠습니까?</h3>
          <p className="text-sm text-gray-500 mt-2">
            선택된 상품을 일괄 삭제하시면 복구할 수 없습니다.
          </p>
        </div>
      </Modal>
    </div>
  )
}
