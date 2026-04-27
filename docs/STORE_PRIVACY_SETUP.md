# 스토어에 개인정보처리방침 등록 방법

개인정보처리방침 **URL**을 스토어 등록정보에 넣어야 합니다. 아래 순서대로 진행하세요.

---

## 1단계: 개인정보처리방침 URL 준비

개인정보처리방침은 **반드시 공개 URL**로 제공해야 합니다. 선택지는 다음과 같습니다.

### 방법 A: GitHub Pages (무료, 추천)

**GitHub이 뭔지 모르시면** → 같은 폴더의 **`GITHUB_PAGES_처음부터_안내.md`**를 먼저 읽어 보세요. 가입부터 URL 만드는 것까지 단계별로 설명해 두었습니다.

요약:
1. 이 프로젝트를 GitHub 저장소에 푸시합니다 (또는 웹에서 `docs` 폴더만 업로드).
2. 저장소 **Settings** → **Pages** 로 이동합니다.
3. **Source**에서 **Deploy from a branch** 선택 후, **Branch**를 `main`(또는 사용 중인 기본 브랜치), **Folder**를 **/docs** 로 선택하고 Save 합니다.
4. 몇 분 후 다음 주소로 접속 가능합니다:
   - `https://<GitHub사용자명>.github.io/<저장소이름>/privacy-policy.html`
   - 예: `https://moonsanghyuk.github.io/RandomPop/privacy-policy.html`

이 URL을 스토어에 등록하면 됩니다.

### 방법 B: 다른 호스팅

- **Notion**: 페이지를 "Publish to web" 한 뒤 나온 링크 사용
- **Google Sites / 자사 웹**: 개인정보처리방침 내용을 올린 페이지 URL 사용
- **무료 정책 생성 사이트**: 예) termly.io, freeprivacypolicy.com 등에서 생성 후 제공 URL 사용

---

## 2단계: Google Play Console에 URL 등록

1. [Google Play Console](https://play.google.com/console) 로그인 후 해당 앱 선택
2. 왼쪽 메뉴에서 **앱 콘텐츠**(또는 **정책** → **앱 콘텐츠**) 클릭
3. **개인정보처리방침** 항목에서 **시작** 또는 **관리** 클릭
4. **개인정보처리방침 URL** 입력란에 1단계에서 만든 URL 입력 (예: `https://moonsanghyuk.github.io/RandomPop/privacy-policy.html`)
5. 저장

**참고**: Google Play는 **데이터 보안** 섹션도 필수입니다. 같은 "앱 콘텐츠" 메뉴에서 **데이터 보안**을 열고, 앱이 수집·공유하는 데이터(광고 ID, 기기 정보 등)를 정확히 선언하세요. AdMob 사용 시 보통 "광고 또는 마케팅", "앱 기능" 등 목적과 함께 데이터 유형을 선택하게 됩니다.

---

## 3단계: Apple App Store Connect에 URL 등록 (iOS 배포 시)

1. [App Store Connect](https://appstoreconnect.apple.com) 로그인 후 해당 앱 선택
2. **앱 정보** (또는 App Information) 로 이동
3. **개인정보 보호 정책 URL** (Privacy Policy URL) 필드에 1단계에서 만든 URL 입력
4. 저장

---

## 4단계: 문서 내용 수정 (필수)

- **PRIVACY_POLICY.md** 및 **docs/privacy-policy.html** 8번 문의처에 **실제 이메일 또는 연락처**를 넣어 주세요.
- 수집하는 데이터나 서비스가 바뀌면 개인정보처리방침도 함께 수정한 뒤, 스토어의 URL은 그대로 두면 됩니다 (같은 URL에서 내용만 갱신).

---

## 만 13세 미만 타겟인 경우

- Google Play: **앱 콘텐츠** → **타겟층 및 콘텐츠**에서 아동 대상 여부를 정확히 표시하고, 필요 시 **가족 정책** 요건을 충족해야 합니다.
- 앱이 만 13세 미만을 주 타겟으로 하지 않는다면, 스토어에서 "주요 타겟에 만 13세 미만 포함 안 함"으로 설정하면 됩니다. 그래도 개인정보처리방침은 **반드시** 제공해야 합니다.

위 단계를 완료하면 스토어 심사 시 개인정보처리방침 요구사항을 충족할 수 있습니다.
