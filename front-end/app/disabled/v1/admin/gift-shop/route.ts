import { NextResponse } from 'next/server';

// 모의 기프트샵 데이터
const mockData = [
  {
    itemIdx: 1,
    itemName: "테스트 침대",
    description: "킹 사이즈 침대",
    price: 500000,
    stockQuantity: 10,
    category: "가구",
    createdAt: "2023-01-15T09:00:00",
    updatedAt: "2023-01-15T09:00:00"
  },
  {
    itemIdx: 2,
    itemName: "테스트 TV",
    description: "55인치 스마트 TV",
    price: 1200000,
    stockQuantity: 5,
    category: "전자제품",
    createdAt: "2023-01-20T10:30:00",
    updatedAt: "2023-02-05T14:15:00"
  },
  {
    itemIdx: 3,
    itemName: "테스트 수건",
    description: "고급 호텔 수건",
    price: 15000,
    stockQuantity: 100,
    category: "욕실용품",
    createdAt: "2023-02-10T11:45:00",
    updatedAt: "2023-02-10T11:45:00"
  }
];

export async function GET(request: Request) {
  // 백엔드 API 서버 응답 시뮬레이션
  console.log('[모의 API] GET /api/v1/admin/gift-shop 호출됨');
  
  // 일부러 지연시간 추가
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(mockData);
}

export async function POST(request: Request) {
  console.log('[모의 API] POST /api/v1/admin/gift-shop 호출됨');
  
  try {
    const body = await request.json();
    console.log('[모의 API] 요청 본문:', body);
    
    // 새 아이템 생성
    const newItem = {
      itemIdx: mockData.length + 1,
      itemName: body.itemName || '새 상품',
      description: body.description || '',
      price: body.price || 0,
      stockQuantity: body.stockQuantity || 0,
      category: body.category || '기타',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 실제로는 배열에 추가하지 않음 (상태 유지 안함)
    // mockData.push(newItem);
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('[모의 API] 오류:', error);
    return NextResponse.json({ error: '요청 처리 중 오류가 발생했습니다' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const itemIds = params.getAll('itemIds');
  
  console.log('[모의 API] DELETE /api/v1/admin/gift-shop 호출됨, ids:', itemIds);
  
  // 성공 응답
  return new NextResponse(null, { status: 204 });
} 