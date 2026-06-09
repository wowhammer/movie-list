# 🎬 Movie Viewer Project — 개발 히스토리

> **URL**: https://wowhammer.github.io/movie-list/movie_viewer.html  
> **데이터 소스**: 구글 시트 (wowhammer / nicehammer@gmail.com)  
> **GitHub**: https://github.com/wowhammer/movie-list  
> **최종 업데이트**: 2026-06-09

---

## 📋 프로젝트 개요

개인 영화 추천 목록을 스마트폰에서 편리하게 검색·열람하기 위한 모바일 웹뷰어.  
구글 시트를 데이터 원본으로 사용하며, 수정 시 새로고침으로 실시간 반영된다.

---

## 🗂️ 데이터 구조

### 구글 시트 컬럼 (현재 기준)
| 열 | 필드명 | 내용 |
|---|---|---|
| A | 원제 | 영문 원제 (Naver 링크 HYPERLINK 수식 포함) |
| B | 한국 개봉명 | 한국어 제목 (JustWatch 링크 HYPERLINK 수식 포함) |
| C | 개봉연도 | 숫자 |
| D | 시청여부 | O = 시청완료, △ = 다시볼것 |
| E | 감독 | 텍스트 |
| F | 배우 | 텍스트 |
| G | 스트리밍 | 넷플릭스/티빙/왓챠/디즈니+/웨이브/쿠팡플레이 |
| H | 추천 | 출처 태그 (/ 구분) |

### 총 영화 수
- 전체: 415편+
- 출처: BBC, 뉴욕타임즈, 오스카, 칸, 베를린, 베니스, AFI, Sight&Sound, 골든글로브, 레딧, Letterboxd, 로저 이버트, 이동진

---

## ⚙️ 구글 시트 Apps Script 함수 목록

```javascript
// 1. 색칠된 셀 카운트 (B열 흰색/없음 제외)
function CountColored(range)

// 2. 색칠 카운트 자동 갱신 (변경 시 트리거)
function refreshCount()

// 3. B열에 JustWatch 링크 자동 삽입
function addJustWatchLinks()

// 4. A열에 Naver 영화 검색 링크 자동 삽입  
function addNaverLinks()

// 5. 뷰어용 JSON API (GET 요청)
function doGet()
```

### 트리거 설정
- `refreshCount` → 스프레드시트 변경 시 자동 실행
- `addJustWatchLinks` / `addNaverLinks` → 열릴 때 자동 실행

### Apps Script 배포 URL (웹앱 API)
```
https://script.google.com/macros/s/AKfycbyfEqz3U7qircviRqSKx2KrBYSYfjsxjznP9UWN00Z19Y0sUF6uaJXy06OmHaSBpK4/exec
```

---

## 🌐 GitHub Pages 뷰어 (`movie_viewer.html`)

### 기술 스택
- 순수 HTML/CSS/JS (프레임워크 없음)
- TMDB API (영화 포스터, 줄거리, 평점)
- Google Apps Script Web App API (시트 데이터)

### 주요 기능
| 기능 | 설명 |
|---|---|
| 상단 통계 | 전체 / 시청완료(O) / 다시볼것(△) 카운트 |
| 탭 검색 | 제목(텍스트) / 감독(셀렉트) / 배우(텍스트) / 스트리밍(셀렉트) / 추천(셀렉트) |
| 시청 뱃지 | 카드에 O(초록) / △(노랑) 표시 |
| 카드 클릭 | TMDB에서 포스터 + 줄거리 + 평점 로드 (lazy) |
| 포스터 썸네일 | 클릭 시 카드 좌측에 포스터 표시 |
| 네이버 버튼 | 새 탭으로 네이버 영화 검색 |
| JustWatch 버튼 | 새 탭으로 JustWatch 스트리밍 검색 |
| 더 보기 | 25편씩 페이지네이션 |

### TMDB API
- **API Key**: `0b9515d29e91abc6465d342963c92482`
- **Base URL**: `https://api.themoviedb.org/3`
- **이미지 Base**: `https://image.tmdb.org/t/p/w200`
- 검색 시 한국어 응답(`language=ko-KR`) 요청
- 결과 캐싱(세션 내) — 같은 영화 중복 호출 방지

---

## 📌 구글 시트 CountColored 함수 사용법

```
=CountColored("B2:B234")
```
- B열 흰색(#ffffff)과 색없음 제외, 나머지 색 있는 셀 카운트
- 자동 갱신: 시트 변경 시 A열 기준 마지막 행+3 위치에 값 업데이트

---

## 🔮 향후 추가 예정

- [ ] 배우/감독 클릭 시 TMDB 인물 정보(사진 + 출연작) 인앱 표시
- [ ] 시청여부 필터 탭 추가 (미시청 / 시청완료 / 다시볼것)

---

## 📁 파일 구조

```
movie-list (GitHub repo)
└── movie_viewer.html       # 메인 뷰어 (전체 코드 단일 파일)

Google Sheets
└── Movie_추천 (gid=789313806)

Google Apps Script
└── Code.gs                 # CountColored, refreshCount, addJustWatchLinks, addNaverLinks, doGet
```

---

*Generated: 2026-06-09*
