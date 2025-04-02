// npm install --save-dev eslint-plugin-import eslint-config-prettier eslint-plugin-prettier
module.exports = {
  // 다른 ESLint 설정을 확장하여 사용
  extends: [
    "next/core-web-vitals", // Next.js의 권장 규칙 및 웹 성능 최적화 규칙
    "eslint:recommended", // ESLint 기본 권장 규칙
    "plugin:@typescript-eslint/recommended", // TypeScript 권장 규칙
    "prettier" // Prettier와 충돌하는 ESLint 규칙 비활성화
  ],

  // 사용할 ESLint 플러그인 목록
  plugins: [
    "@typescript-eslint", // TypeScript 관련 규칙
    "react-hooks", // React Hooks 규칙
    "import", // import 문 관련 규칙
    "prettier" // Prettier 규칙
  ],

  // 개별 규칙 설정
  rules: {
    // Prettier 규칙을 ESLint 오류로 간주
    "prettier/prettier": "error",

    // 불필요한 삼항 연산자 사용 금지 (예: a ? true : false -> a)
    "no-unneeded-ternary": "error",

    // 기본 미사용 변수 규칙은 비활성화 (TypeScript 버전 사용)
    "no-unused-vars": "off",

    // TypeScript의 미사용 변수 규칙 설정
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_", // _ 로 시작하는 매개변수는 무시
        varsIgnorePattern: "^_" // _ 로 시작하는 변수는 무시
      }
    ],

    // console.log 사용 시 경고 (console.warn, console.error는 허용)
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // 함수 반환 타입 명시적 지정 요구 비활성화 (TypeScript의 타입 추론 활용)
    "@typescript-eslint/explicit-function-return-type": "off",

    // 모듈 경계에서 명시적 타입 지정 요구 비활성화
    "@typescript-eslint/explicit-module-boundary-types": "off",

    // 클래스 멤버 구성요소 정렬 규칙 (경고)
    "@typescript-eslint/member-ordering": "warn",

    // React 17 이상에서는 불필요해진 import React 구문 검사 비활성화
    "react/react-in-jsx-scope": "off",

    // PropTypes 검사 비활성화 (TypeScript 사용 시 불필요)
    "react/prop-types": "off",

    // display-name 관련 규칙 비활성화 (불필요한 경우 많음)
    "react/display-name": "off",

    // React Hooks 규칙 강제 (예: useState는 조건문 안에서 사용 불가)
    "react-hooks/rules-of-hooks": "error",

    // useEffect 의존성 배열 체크 (의존성 배열에 누락된 항목 있을 경우 경고)
    "react-hooks/exhaustive-deps": "warn",

    // import 문 정렬 규칙
    "import/order": [
      "warn",
      {
        // import 문 그룹화 순서
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        // 그룹 사이에 빈 줄 추가
        "newlines-between": "always",
        // 알파벳 순 정렬
        alphabetize: { order: "asc", caseInsensitive: true }
      }
    ]
  }
};