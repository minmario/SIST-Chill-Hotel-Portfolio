export default function Loading() {
  return (
    <div className="container mx-auto py-20 px-4 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-color mx-auto"></div>
          <p className="mt-4 text-lg">예약 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    </div>
  )
}

