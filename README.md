 # (프로젝트명)
(개요, 프로젝트 소개)

 ## 📝 주요기능

 ## 🔨 기술스택 
<!-- 
(백엔드, 프론트, 협업에 사용한 툴, 라이브러리, 프레임워크)

기술스택 배지 추가하는 방법 
1. https://simpleicons.org/ 에서 기술스택명 검색
2. 기술스택의 로고, 컬러 HEX 코드를 아래와 같이 입력
  - https://img.shields.io/badge/<표시될 이름>-<컬러 HEX>?style=for-the-badge&logo=<로고명>
3. 해당 URL로 마크다운 이미지 첨부
  - ![이미지명](URL) 형식
-->

(백엔드, 프론트, 협업에 사용한 툴, 라이브러리, 프레임워크)

![intellij](https://img.shields.io/badge/intellij_idea-000000?style=for-the-badge&logo=intellijidea&logoColor=white)
![vscode](https://img.shields.io/badge/vscode-000000?style=for-the-badge&logo=vscode&logoColor=white)
![androidstudio](https://img.shields.io/badge/android_studio-3DDC84?style=for-the-badge&logo=androidstudio&logoColor=white)  

![docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![nginx](https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge&logo=redis&logoColor=white)
![github-action](https://img.shields.io/badge/github_actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

![react](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![jetpack-compose](https://img.shields.io/badge/jetpack_compose-4285F4?style=for-the-badge&logo=jetpackcompose&logoColor=white)
![spring](https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

| 스택 | 설명 | 용도 |
|-----|-----|-----|
| 스택1 | 스택에 대한 설명 | 프로젝트 쓰임새 |
| ... | ... | ... |

 ## 🖼️ 스크린샷

 ## 🤝 개발협업
 ### 🌲 Branch 
```
main ------- backend/<이름>/(<이슈번호>-)<작업명>    (백엔드 작업)
     \------ frontend/<이름>/(<이슈번호>-)<작업명>   (프론트 작업)

ex) backend/wonseok/#10-add-animation
ex) frontend/wonseok/fix-login-not-allowed   (이슈가 없으면)
```
브랜치 관리 전략은 `main`과 개인 브랜치만이 존재하는 간단한 Github Flow를 따릅니다.
- `main` 브랜치는 항상 작동 가능한 안정된 상태여야 한다.
  - 직접 커밋하지 않으며, Pull Request만으로 변경한다.
- 개인 브랜치에서 작업을 진행한다.
- 브랜치명은 작업 내용과 직군이 구체적으로 드러나도록 한다.
  - 브랜치명에 `backend`, `frontend`를 구분한다.
  - 띄어쓰기는 하이픈(`-`)으로 구분한다.
  - 브랜치명은 전부 소문자를 사용한다.

프로젝트에 CI/CD를 구성하는 등 규모가 커지면 `develop` 브랜치를 추가하거나 `git flow`로 전환할 수 있습니다. 

 ### 🍪 Pull Request
```
main    ---●---●---●---------● abc (Squash Merge)
                \           /
개인브랜치          a---b---c   ('abc' 합쳐진 하나의 커밋으로 병합)

PR 제목: [Backend/Frontend] <이슈번호> <작업명>
ex) [Backend] #10 프로필 화면에서 로그인 불가하던 문제 해결
ex) [Backend] 프로필 화면에서 로그인 불가하던 문제 해결     (이슈가 없으면)
```
`main` 브랜치의 커밋은 Pull Request 단위로 쌓으며 이를 위해 **Squash Merge**를 원칙으로 합니다. **Squash Merge**는 브랜치가 병합될 때 커밋들이 PR 제목으로 합쳐지게 됩니다. 커밋은 개인마다 기준이 조금씩 다른 반면, PR/브랜치는 이슈 단위로 생성하므로 일관된 기준으로 커밋을 쌓을 수 있어 히스토리 추적을 용이하게 합니다.
- 커밋 제목은 **PR 제목**으로 한다.
    - Backend/Frontend를 구분한다.
    - 작업 내용을 구체적으로 드러나게 적는다.
- 커밋 내용은 **PR 내용**으로 한다.
    - 브랜치에서의 변경점을 상세히 적는다.
- Pull Request는 작은 작업 단위(200줄 이내 권장)로 한다.

 ## 🛠 설치방법
(다른 개발자가 이 프로젝트를 테스트해볼 수 있도록 프론트, 백엔드 설치/실행 절차 안내)

### 💻 Frontend

### 💻 Backend

 ## 🧑‍💻 팀원
| <img width="100" src="https://github.com/cotidie.png"> | <img width="100" src="https://github.com/github.png"> | 
|:----------------------:|:----------------------:|
| [장원석](https://github.com/cotidie) | [팀원](https://github.com/cotidie) |
| 💻 Android | 💻 역할 |
| 15기 | 기수 |

 
