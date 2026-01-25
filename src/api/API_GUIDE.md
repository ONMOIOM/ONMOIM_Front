# API 사용 가이드

## 예시: 로그인 API 호출

**1. API 함수** (`src/api/auth.ts`에 정의됨)


import { login } from '../api/auth';

const res = await login({ email: 'user@example.com', authcode: '123456' });
if (res.success) {
  console.log('성공:', res.data);
} else {
  alert(res.message);
}


**2. 페이지에서 사용**

// src/pages/Login/Login.tsx
import { login } from '../../api/auth';

const handleSubmit = async () => {
  const res = await login({ email, authcode });
  if (res.success && res.data?.accessToken) {
    localStorage.setItem('token', res.data.accessToken);
    navigate('/');
  } else {
    alert(res.message ?? '로그인 실패');
  }
};
```
- `axiosInstance` 사용 → baseURL, Authorization 자동 적용
- `BaseResponse<T>` → `success`, `code`, `message`, `data` 공통 규격