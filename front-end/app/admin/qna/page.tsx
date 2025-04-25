"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

// 한글 표시 매핑
const typeLabelMap: Record<string, string> = {
  reservation: "예약 문의",
  facility: "시설 문의",
  dining: "다이닝 문의",
  promotion: "이벤트/프로모션 문의",
  etc: "기타 문의",
};

const statusLabelMap: Record<string, string> = {
  PENDING: "대기",
  ANSWERED: "완료",
};

interface Qna {
  qnaIdx: number;
  title: string;
  content: string;
  email: string;
  type: string;
  answer: string | null;
  writeDate: string;
  status: string;
}

export default function AdminQnaPage() {
  const [qnaList, setQnaList] = useState<Qna[]>([]);
  const [selectedQna, setSelectedQna] = useState<Qna | null>(null);
  const [answer, setAnswer] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    const fetchQnaList = async () => {
      try {
        const res = await axios.get("/api/qna");
        setQnaList(res.data);
      } catch (error) {
        console.error("QnA 목록 불러오기 실패", error);
      }
    };

    fetchQnaList();
  }, []);

  const handleSubmit = async () => {
    if (!selectedQna) return;
    try {
      await axios.post("/api/qna/admin/answer", {
        qnaIdx: selectedQna.qnaIdx,
        answer,
      });
      alert("답변이 전송되었습니다.");
      setAnswer("");
      setSelectedQna(null);

      const res = await axios.get("/api/qna");
      setQnaList(res.data);
    } catch (error) {
      console.error("답변 전송 오류", error);
      alert("답변 전송에 실패했습니다.");
    }
  };

  const filteredQnaList = qnaList.filter((qna) => {
    const statusMatch = statusFilter === "ALL" || qna.status === statusFilter;
    const typeMatch = typeFilter === "ALL" || qna.type === typeFilter;
    return statusMatch && typeMatch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">문의 관리</h1>

      {/* 🔽 필터 */}
      {!selectedQna && (
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 font-semibold">답변 상태</label>
            <select
              className="border rounded px-2 py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="PENDING">대기</option>
              <option value="ANSWERED">완료</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 font-semibold">문의 유형</label>
            <select
              className="border rounded px-2 py-1"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="reservation">예약 문의</option>
              <option value="facility">시설 문의</option>
              <option value="dining">다이닝 문의</option>
              <option value="promotion">이벤트/프로모션 문의</option>
              <option value="etc">기타 문의</option>
            </select>
          </div>
        </div>
      )}

      {!selectedQna ? (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">제목</th>
              <th className="p-2 border">이메일</th>
              <th className="p-2 border">문의 유형</th>
              <th className="p-2 border">작성일</th>
              <th className="p-2 border">답변 상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredQnaList.map((qna) => (
              <tr
                key={qna.qnaIdx}
                onClick={() => {
                  setSelectedQna(qna);
                  setAnswer(qna.answer || "");
                }}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="p-2 border">{qna.title}</td>
                <td className="p-2 border">{qna.email}</td>
                <td className="p-2 border">{typeLabelMap[qna.type] || "기타 문의"}</td>
                <td className="p-2 border">
                  {format(new Date(qna.writeDate), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="p-2 border">
                  {qna.status === "ANSWERED" ? "✅ 완료" : "⌛ 대기"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{selectedQna.title}</h2>

          <div className="text-sm text-gray-600 space-y-1 mb-4">
            <p><strong>작성자:</strong> {selectedQna.email}</p>
            <p><strong>문의 유형:</strong> {typeLabelMap[selectedQna.type] || "기타 문의"}</p>
            <p><strong>작성일:</strong> {format(new Date(selectedQna.writeDate), "yyyy-MM-dd HH:mm")}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded border whitespace-pre-wrap">
            {selectedQna.content}
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded"
            placeholder="답변 내용을 입력하세요..."
          />

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              답변 전송
            </button>
            <button
              onClick={() => setSelectedQna(null)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              목록으로
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
