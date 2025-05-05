"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  image: string;
  capacity: number;
  price: {
    adult: number;
    child: number;
  };
  breakfastOpen?: string | null;
  breakfastClose?: string | null;
  lunchOpen?: string | null;
  lunchClose?: string | null;
  dinnerOpen?: string | null;
  dinnerClose?: string | null;
}

export default function DiningReservePage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = Number(params?.id);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [mealTime, setMealTime] = useState<"breakfast" | "lunch" | "dinner">("lunch");
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("ko-KR", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}`);
        // console.log("fetching from:", `/api/restaurants/${restaurantId}`);
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error("레스토랑 정보 불러오기 실패", err);
      }
    };

    if (restaurantId) fetchRestaurant();
  }, [restaurantId]);

  const generateTimeOptions = (start?: string | null, end?: string | null): string[] => {
    if (!start || !end) return [];

    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);

    const times: string[] = [];
    const current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    while (current <= endTime) {
      times.push(current.toTimeString().slice(0, 5)); // "HH:MM"
      current.setMinutes(current.getMinutes() + 30);
    }

    return times;
  };

  const getTimeOptions = (): string[] => {
    if (!restaurant) return [];
    switch (mealTime) {
      case "breakfast":
        return generateTimeOptions(restaurant.breakfastOpen, restaurant.breakfastClose);
      case "lunch":
        return generateTimeOptions(restaurant.lunchOpen, restaurant.lunchClose);
      case "dinner":
        return generateTimeOptions(restaurant.dinnerOpen, restaurant.dinnerClose);
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    const reservationData = {
      restaurantId: restaurant?.id,
      reservationDate: date,
      mealTime: mealTime.toUpperCase(),
      reservationTime: time,
      adults,
      children,
      firstName,
      lastName,
      phone,
      email,
      request,
    };
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const res = await fetch("/api/dining/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(reservationData),
      });
  
      if (res.ok) {
        const result = await res.json();
        localStorage.setItem("reservationResult", JSON.stringify(result));
        router.push("/dining/reserve/complete");
      } else {
        const errorText = await res.text();
        alert("예약 실패: " + errorText);
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  if (!restaurant) return <div className="p-10 text-center">존재하지 않는 레스토랑입니다.</div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/dining" className="inline-block mb-4 text-sm text-gray-500 hover:text-gray-700">
        ← 다이닝 목록으로 돌아가기
      </Link>

      {/* 예약 단계 표시 */}
      <div className="flex items-center justify-left mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= num ? "bg-[#2dd4bf] text-white" : "bg-gray-200 text-gray-600"
            }`}>{num}</div>
            {num < 3 && <div className={`h-1 w-16 ${step > num ? "bg-[#2dd4bf]" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* 예약 폼 */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{restaurant.name} 예약</h1>
          <p className="text-gray-600 mb-8">{restaurant.description}</p>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="block font-medium mb-1">방문 날짜</label>
                <input type="date" className="w-full border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label className="block font-medium mb-1">식사 시간</label>
                <div className="flex gap-4">
                  {restaurant.breakfastOpen && (
                    <label><input type="radio" value="breakfast" checked={mealTime === "breakfast"} onChange={() => setMealTime("breakfast")} className="mr-2" />아침</label>
                  )}
                  {restaurant.lunchOpen && (
                    <label><input type="radio" value="lunch" checked={mealTime === "lunch"} onChange={() => setMealTime("lunch")} className="mr-2" />점심</label>
                  )}
                  {restaurant.dinnerOpen && (
                    <label><input type="radio" value="dinner" checked={mealTime === "dinner"} onChange={() => setMealTime("dinner")} className="mr-2" />저녁</label>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">시간 선택</label>
                <select className="w-full border p-2 rounded" value={time} onChange={(e) => setTime(e.target.value)}>
                  <option value="">시간을 선택하세요</option>
                  {getTimeOptions().map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              {/* 인원 선택 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">성인</label>
                  <select className="w-full border p-2 rounded" value={adults} onChange={(e) => setAdults(Number(e.target.value))}>
                    {[...Array(5)].map((_, i) => <option key={i} value={i + 1}>{i + 1}명</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">어린이</label>
                  <select className="w-full border p-2 rounded" value={children} onChange={(e) => setChildren(Number(e.target.value))}>
                    {[...Array(5)].map((_, i) => <option key={i} value={i}>{i}명</option>)}
                  </select>
                </div>
              </div>
              <button onClick={next} className="mt-4 bg-teal-500 text-white px-4 py-2 rounded" 
              disabled={!date || !time || adults + children > 5}>다음 단계</button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 max-w-xl">
              <div><label className="block font-medium mb-1">성</label><input type="text" className="w-full border p-2 rounded" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
              <div><label className="block font-medium mb-1">이름</label><input type="text" className="w-full border p-2 rounded" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
              <div><label className="block font-medium mb-1">연락처</label><input type="tel" className="w-full border p-2 rounded" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
              <div>
                <label className="block font-medium mb-1">이메일</label>
                <input type="email" className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" />
                {email && !isEmailValid(email) && <p className="text-red-500 text-sm mt-1">올바른 이메일 형식이 아닙니다.</p>}
              </div>
              <div><label className="block font-medium mb-1">요청사항</label><textarea className="w-full border p-2 rounded" rows={3} value={request} onChange={(e) => setRequest(e.target.value)} /></div>
              <div className="flex gap-2">
                <button onClick={back} className="bg-gray-200 px-4 py-2 rounded">이전</button>
                <button onClick={next} className="bg-teal-500 text-white px-4 py-2 rounded" disabled={!lastName || !firstName || !phone || !email || !isEmailValid(email)}>
                  다음 단계
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 max-w-xl">
              <h2 className="text-xl font-semibold mb-6">예약 확인</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>날짜:</strong> {formatDate(date)}</li>
                  <li><strong>식사 시간:</strong> {mealTime === "lunch" ? "점심" : "저녁"}</li>
                  <li><strong>시간:</strong> {time}</li>
                  <li><strong>인원:</strong> 성인 {adults}명 / 어린이 {children}명</li>
                  <li><strong>예약자:</strong> {lastName} {firstName}</li>
                  <li><strong>연락처:</strong> {phone}</li>
                  <li><strong>이메일:</strong> {email}</li>
                  {request && <li><strong>요청사항:</strong> {request}</li>}
                </ul>
              </div>

              {/* 예약자 정보 강조 */}
              <div className="text-sm text-gray-600">
                ※ 입력하신 정보는 수정할 수 없습니다. 정확한 정보를 입력했는지 다시 확인해주세요.
              </div>

              {/* ✅ 총 결제 금액 표시 */}
              <div className="text-lg font-semibold text-right text-teal-600">
                총 결제 금액:{" "}
                {(adults * (restaurant?.price?.adult || 0) + children * (restaurant?.price?.child || 0)).toLocaleString()}
                원
              </div>

              {/* 추가 안내 정보 */}
              

              <div className="mb-6">
                <h3 className="font-semibold mb-2">이용약관</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 h-40 overflow-y-auto text-sm">
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>예약 취소 및 변경은 예약 시간으로부터 24시간 전까지 가능합니다.</li>
                    <li>24시간 이내 취소 또는 노쇼(No-show)의 경우, 위약금이 발생할 수 있습니다.</li>
                    <li>예약 시간보다 15분 이상 늦을 경우, 예약이 취소될 수 있습니다.</li>
                    <li>레스토랑 사정에 따라 예약이 변경되거나 취소될 수 있으며, 이 경우 사전에 안내해 드립니다.</li>
                    <li>특별한 요청사항은 가능한 한 반영해 드리나, 보장되지 않을 수 있습니다.</li>
                    <li>개인정보는 예약 및 서비스 제공 목적으로만 사용되며, 예약 완료 후 3개월간 보관됩니다.</li>
                  </ol>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mr-2"
                  />
                  이용약관에 동의합니다.
                </label>
              </div>

              <div className="flex gap-2">
                <button onClick={back} className="bg-gray-300 px-4 py-2 rounded">이전</button>
                <button onClick={handleSubmit} className="bg-teal-500 text-white px-4 py-2 rounded" disabled={!agreeTerms}>예약 완료</button>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 레스토랑 정보 카드 */}
        <div className="bg-white rounded-lg shadow p-4">
          <Image src={restaurant.image} alt={restaurant.name} width={600} height={400} className="rounded mb-4" />
          <h2 className="text-lg font-semibold mb-2">{restaurant.name}</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>위치:</strong> {restaurant.location}</li>
            <li><strong>좌석 수:</strong> {restaurant.capacity}석</li>
            <li><strong>가격:</strong> 성인 {restaurant.price?.adult?.toLocaleString()}원 / 어린이 {restaurant.price?.child?.toLocaleString()}원</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>* 예약 확정 후 변경 및 취소는 예약 시간 24시간 전까지 가능합니다.</p>
            <p>* 특별 이벤트 및 프로모션은 별도 공지됩니다.</p>
          </div>
          <div className="text-sm text-gray-500 space-y-2">
            <p>* 식사 소요 시간은 평균 90분입니다.</p>
            <p>* 결제는 레스토랑 현장에서 진행됩니다. (카드/현금 모두 가능)</p>
            <p>* 예약 관련 문의는 02-1234-5678 (운영시간 09:00~18:00)로 연락주세요.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
