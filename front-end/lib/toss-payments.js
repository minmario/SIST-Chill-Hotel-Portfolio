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
    
    // 주문 ID 생성 (중복 방지를 위해 타임스탬프 추가)
    const timestamp = new Date().getTime();
    const orderId = orderData.paymentType + '_' + orderData.id;
    
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
    
    const response = await fetch('http://localhost:8080/api/payments/toss/success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
        status: 'DONE',
        message: '토스 결제 성공'
      })
    });
    
    if (!response.ok) {
      throw new Error('결제 상태 확인 중 오류가 발생했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('결제 상태 확인 중 오류:', error);
    throw error;
  }
}; 