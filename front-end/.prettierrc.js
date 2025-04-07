module.exports = {
  // 문장 끝에 세미콜론 사용 (true: 사용, false: 미사용)
  semi: true,

  // 문자열에 작은따옴표 사용 (true: 작은따옴표, false: 큰따옴표)
  singleQuote: true,

  // 탭 너비를 2칸으로 설정
  tabWidth: 2,

  // 한 줄의 최대 길이를 100자로 제한 (이 길이를 초과하면 자동 줄바꿈)
  printWidth: 100,

  // 객체, 배열 등의 마지막 항목 뒤에 쉼표 추가 방식
  // (none: 쉼표 없음, es5: ES5에서 유효한 위치에 쉼표 추가, all: 가능한 모든 위치에 쉼표 추가)
  trailingComma: 'es5',

  // 객체 리터럴의 중괄호 사이에 공백 추가 (true: { foo: bar }, false: {foo: bar})
  bracketSpacing: true,

  // 화살표 함수의 매개변수가 하나일 때 괄호 사용 방식
  // (always: 항상 괄호 사용, avoid: 가능하면 괄호 생략)
  arrowParens: 'always',

  // 줄바꿈 문자 설정 (auto, lf, crlf, cr)
  // auto: 기존 줄 끝 형식 유지 (첫 줄 끝 문자 기준)
  endOfLine: 'auto',

  // JSX에서 작은따옴표 대신 큰따옴표 사용 (true: 큰따옴표, false: 작은따옴표)
  // singleQuote가 true여도 JSX에서만 큰따옴표 사용 가능
  jsxSingleQuote: false,

  // JSX 요소의 닫는 꺾쇠를 다음 줄에 배치 (true: 다음 줄, false: 같은 줄)
  jsxBracketSameLine: false,

  // 마크다운 텍스트의 줄바꿈 방식
  // (always: 항상 줄바꿈, never: 줄바꿈 안함, preserve: 원본 유지)
  proseWrap: 'preserve'
};