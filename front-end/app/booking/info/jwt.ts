// JWT payload에서 membershipIdx 추출 함수 (라이브러리 없이)
export function extractMembershipIdxFromToken(token: string): number | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    // base64url 디코딩
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    // membershipIdx, membership_idx 둘 다 대응
    const idx = payload.membershipIdx ?? payload.membership_idx ?? null;
    return idx;
  } catch (e) {
    return null;
  }
}

// JWT payload에서 userName(아이디)만 추출 (info 영향 X)
export function extractSubFromToken(token: string): string | null {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.sub ?? null;
  } catch (e) {
    return null;
  }
}


