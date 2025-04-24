"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

interface Qna {
  qnaIdx: number;
  type: string;
  title: string;
  content: string;
  email: string;
  answer: string | null;
  writeDate: string;
}

export default function AdminQnaPage() {
  const [qnaList, setQnaList] = useState<Qna[]>([]);
  const [selectedQna, setSelectedQna] = useState<Qna | null>(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchQnaList = async () => {
      try {
        const res = await axios.get("/api/qna"); // ✅ 수정된 백엔드 API 경로
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

      // 다시 목록 새로고침
      const res = await axios.get("/api/qna");
      setQnaList(res.data);
    } catch (error) {
      console.error("답변 전송 오류", error);
      alert("답변 전송에 실패했습니다.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">문의 관리</h1>

      {!selectedQna ? (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">제목</th>
              <th className="p-2 border">이메일</th>
              <th className="p-2 border">작성일</th>
              <th className="p-2 border">답변 상태</th>
            </tr>
          </thead>
          <tbody>
            {qnaList.map((qna) => (
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
                <td className="p-2 border">
                  {format(new Date(qna.writeDate), "yyyy-MM-dd HH:mm")}
                </td>
                <td className="p-2 border">
                  {qna.answer ? "✅ 완료" : "⌛ 대기"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{selectedQna.title}</h2>
          <p className="text-sm text-gray-500">작성자: {selectedQna.email}</p>
          <p className="bg-gray-50 p-4 rounded border">{selectedQna.content}</p>

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
