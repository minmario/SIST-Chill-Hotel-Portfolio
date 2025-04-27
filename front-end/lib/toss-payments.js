// 토스 페이먼츠 결제 초기화 함수
export const initTossPayment = async (orderData) => {
  try {
    // 클라이언트 키 (실제 상용에서는 환경 변수로 관리해야 함)
    const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
    
    // 토스 페이먼츠 SDK가 이미 로드되었는지 확인
    if (!window.TossPayments) {
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1/payment-widget';
      script.async = true;
      document.body.appendChild(script);
      
      // 스크립트 로드 완료 대기
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
    
    // 결제 위젯 초기화
    const tossPayments = window.TossPayments(clientKey);
    
    // 주문 ID 생성 - 항상 고유한 주문번호 생성을 위해 타임스탬프와 난수 추가
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10); // 랜덤 문자열 생성
    const orderId = `${orderData.paymentType}_${orderData.id}_${timestamp}_${randomString}`;
    console.log('생성된 주문번호:', orderId);
    
    // 결제 요청
    await tossPayments.requestPayment(orderData.method, {
      amount: orderData.amount,
      orderId: orderId,
      orderName: orderData.name,
      customerName: orderData.customerName,
      successUrl: window.location.origin + '/checkout/success',
      failUrl: window.location.origin + '/checkout/fail',
    });
    
    return { success: true };
  } catch (error) {
    console.error('토스 페이먼츠 초기화 중 오류:', error);
    return { 
      success: false,
      message: error.message || '결제 초기화 중 오류가 발생했습니다.'
    };
  }
};

// 결제 상태 확인 함수
export const checkPaymentStatus = async (paymentKey, orderId, amount) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.warn('토큰이 없습니다. 로그인 상태를 확인하세요.');
    }
    
    const response = await fetch('/api/payments/toss/success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
        status: 'DONE',
        message: '토스 결제 성공'
      }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      // 409(중복 결제)도 성공으로 간주
      if (response.status === 409) {
        // 이미 결제된 상태이므로 성공처럼 처리 (alert 제거)
        return { alreadyPaid: true };
      }
      // 나머지 에러는 기존대로 처리
      const errorText = await response.text();
      if (response.status === 404) {
        alert('이미 삭제되었거나 존재하지 않는 데이터입니다.');
      } else if (response.status === 400) {
        alert('결제 요청이 잘못되었습니다.');
      } else {
        alert('결제 상태 확인 중 오류가 발생했습니다.');
      }
      console.error(`결제 상태 확인 오류: ${response.status}`, errorText);
      throw new Error(`결제 상태 확인 중 오류가 발생했습니다. (${response.status})`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('결제 상태 확인 중 오류:', error);
    throw error;
  }
}; 