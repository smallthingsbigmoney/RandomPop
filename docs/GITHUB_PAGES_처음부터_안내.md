# GitHub이 뭔지 모를 때 — 개인정보처리방침 URL 만들기 (처음부터 안내)

---

## GitHub이 뭔가요?

**GitHub**는 "코드(프로젝트 파일)를 인터넷에 올려 두는 사이트"라고 생각하면 됩니다.

- **비유**: 네이버 클라우드나 Google 드라이브에 폴더를 올리듯, **프로그램/앱 소스 코드**를 올려 두는 곳입니다.
- **개발자들이 많이 씁니다.** 코드 공유, 백업, 협업용으로 쓰고요.
- **무료**로 가입할 수 있고, **GitHub Pages**라는 기능으로 올려 둔 파일을 **웹 주소(URL)**로 누구나 볼 수 있게 할 수 있습니다.

우리는 이 **GitHub Pages**를 써서, `docs` 폴더 안의 `privacy-policy.html`을 **공개 URL**로 만들 겁니다.  
그 URL을 Google Play·App Store의 "개인정보처리방침 URL"란에 넣으면 됩니다.

---

## 전체 흐름 (한 줄 요약)

1. **GitHub에 가입**한다.
2. **새 저장소(Repository)**를 하나 만든다.
3. **프로젝트 파일**을 그 저장소에 올린다. (또는 이미 Git을 쓰고 있다면 푸시)
4. **Pages 설정**에서 "`main` 브랜치의 `/docs` 폴더"를 선택해 **배포**한다.
5. 몇 분 후 **나오는 주소**가 개인정보처리방침 URL이다.

아래는 이걸 **한 단계씩** 설명한 것입니다.

---

## 1단계: GitHub 가입

1. 브라우저에서 **https://github.com** 접속
2. 오른쪽 위 **Sign up** 클릭
3. 이메일, 비밀번호, 사용할 **사용자명(Username)** 입력 후 가입
4. 이메일 인증 등 안내에 따라 완료

가입이 끝나면 **사용자명**을 기억해 두세요.  
(예: `moonsanghyuk`)  
→ 나중에 URL이 `https://moonsanghyuk.github.io/...` 형태가 됩니다.

---

## 2단계: 새 저장소(Repository) 만들기

**저장소(Repository, Repo)** = GitHub에 만드는 "프로젝트 하나당 하나의 폴더"라고 보면 됩니다.

1. GitHub 로그인 후 **오른쪽 위 +** 버튼 클릭 → **New repository** 선택
2. **Repository name**에 영어로 이름 입력 (예: `RandomPop`)  
   - 띄어쓰기 없이, 대소문자 구분됨. 이 이름이 URL에 들어갑니다.
3. **Public** 선택
4. **"Add a README file"** 같은 건 체크하지 **않아도** 됩니다 (이미 로컬에 프로젝트가 있으므로)
5. **Create repository** 클릭

만들어지면 `https://github.com/<사용자명>/<저장소이름>` 같은 주소의 빈(또는 README만 있는) 저장소 페이지가 나옵니다.

---

## 3단계: 프로젝트를 GitHub에 올리기

RandomPop 프로젝트를 방금 만든 저장소에 올려야 합니다. **두 가지 방법** 중 하나만 하면 됩니다.

### 방법 A: 웹에서 폴더 올리기 (Git을 안 써도 됨)

- **주의**: 전체 프로젝트가 크면 `node_modules` 때문에 느리거나 실패할 수 있습니다.  
  **개인정보처리방침 URL만** 필요하다면 **`docs` 폴더만** 올리는 게 좋습니다.

1. GitHub 저장소 페이지에서 **Add file** → **Upload files** 클릭
2. 컴퓨터에서 **RandomPop 폴더 안의 `docs` 폴더**를 열어서  
   **그 안의 파일들** (`privacy-policy.html`, `STORE_DESCRIPTIONS.md` 등)을 끌어다 놓거나 **Choose your files**로 선택
3. 아래쪽 **Commit changes** 버튼으로 저장

이렇게 하면 `main` 브랜치에 `docs/privacy-policy.html` 등이 올라갑니다.  
(나중에 4단계에서 이 `docs` 폴더를 Pages로 켭니다.)

- **전체 프로젝트**를 올리고 싶다면:  
  RandomPop 폴더에서 **`node_modules` 폴더는 제외**하고 나머지만 선택해 올리세요.  
  그러면 `docs` 폴더도 함께 올라가서, 역시 4단계에서 `docs`만 Pages로 쓰면 됩니다.

### 방법 B: 이미 Git을 쓰고 있다면 (터미널)

로컬에서 이미 `git init` 하고 커밋까지 해 두었다면:

1. GitHub 저장소 페이지에서 보이는 **"…or push an existing repository from the command line"** 안의 명령어를 복사
2. 터미널을 열고 **RandomPop 프로젝트 폴더**로 이동한 뒤, 그 명령어 두 줄 실행  
   (대략 `git remote add origin https://github.com/<사용자명>/<저장소이름>.git` 와 `git push -u origin main`)

이렇게 하면 로컬에 있는 `docs` 폴더 포함 전체가 GitHub에 올라갑니다.

---

## 4단계: GitHub Pages 켜기 (URL 만들기)

1. **해당 GitHub 저장소 페이지**로 이동
2. **위쪽 메뉴에서 Settings** 클릭
3. 왼쪽 사이드바 아래쪽 **Pages** 클릭
4. **Build and deployment** 섹션에서:
   - **Source**: **Deploy from a branch** 선택
   - **Branch**: `main` (또는 사용 중인 기본 브랜치) 선택
   - **Folder**: **/ (root)** 가 아니라 **/docs** 선택
   - **Save** 클릭

5. 몇 분 기다리면 위쪽에  
   **"Your site is live at https://\<사용자명>.github.io/\<저장소이름>/"**  
   같은 문구가 뜹니다.

---

## 5단계: 개인정보처리방침 URL 확인

- **사이트 주소**: `https://<사용자명>.github.io/<저장소이름>/`  
  (예: `https://moonsanghyuk.github.io/RandomPop/`)
- **개인정보처리방침 페이지 주소**:  
  `https://<사용자명>.github.io/<저장소이름>/privacy-policy.html`  
  (예: `https://moonsanghyuk.github.io/RandomPop/privacy-policy.html`)

브라우저에서 **개인정보처리방침 페이지 주소**를 열어 보세요.  
"Random Pop 개인정보처리방침" 글이 보이면 성공입니다.  
→ **이 주소를 복사해서** Google Play·App Store의 "개인정보처리방침 URL"란에 넣으면 됩니다.

---

## 정리

| 단계 | 할 일 |
|------|--------|
| 1 | GitHub 가입 (github.com) |
| 2 | 새 저장소 만들기 (예: 이름 `RandomPop`) |
| 3 | `docs` 폴더(또는 전체 프로젝트)를 그 저장소에 올리기 |
| 4 | 저장소 **Settings → Pages** → Source: Deploy from a branch, Branch: main, **Folder: /docs** → Save |
| 5 | 나온 주소 + `/privacy-policy.html` 이 개인정보처리방침 URL |

---

## 자주 묻는 것

- **Git이 뭔지 몰라요**  
  → 이 안내에서는 **방법 A(웹에서 `docs` 올리기)**만 해도 URL을 만들 수 있습니다. Git 설치 없이 가능합니다.

- **저장소 이름을 바꾸고 싶어요**  
  → Settings → Repository name 변경 가능. 바꾸면 URL도 `...github.io/<새이름>/...` 로 바뀝니다.

- **나중에 개인정보처리방침 내용만 수정하고 싶어요**  
  → GitHub 저장소에서 `docs/privacy-policy.html` 파일 클릭 → 연필 아이콘(Edit) → 내용 수정 → Commit changes.  
  URL은 그대로 두고, 같은 주소에서 내용만 바뀝니다.

- **URL이 안 열려요**  
  → Folder를 **/docs**로 했는지, `docs` 안에 `privacy-policy.html`이 있는지 확인하세요.  
  저장 후 1~2분 기다려 보세요.

이렇게 하면 "GitHub이 뭔지 몰라도" 순서만 따라 하면 개인정보처리방침 URL을 만들 수 있습니다.
