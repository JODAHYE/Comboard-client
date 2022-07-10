
# 서비스 설명
https://comboard.netlify.app

게시판을 생성하고, 게시판에 맞는 게시글을 작성하여 사용자들과 소통하고 정보를 얻는 등 **자유로운 커뮤니티 사이트**입니다.


# 사용 기술 스택

프론트: React.js, Redux, Redux Saga, Styled-components, Typescript

백엔드: Node.js, Express, mongoose, cloudinary

# 배포
프론트: netlify
백엔드: AWS EC2

# **🔨 기능 소개**

**로그인**

- 간단한 회원가입과 로그인, 로그아웃 / 카카오 api를 이용하여 간편하게 로그인

**메인**

- 메인 화면에서 게시판을 생성할 수 있습니다. 제목, 게시판 유형(공개/비밀), 게시판 사진 등을 입력 받아 생성합니다.
- 게시판 리스트를 무한스크롤로 불러옵니다.
- 암호가 설정된 비밀 게시판은 게시판 제목 검색을 통해 렌더링되며, 게시판 클릭 시 암호를 입력해야 해당 게시판의 게시글들을 볼 수 있습니다.

**게시판 디테일 페이지(게시글 리스트)**

- 사용자들이 작성한 게시글들을 한 페이지당 22개씩 페이지네이션 방식으로 불러옵니다.
게시글들을 최신순/조회순/추천순/댓글순으로 정렬해 불러올 수 있습니다.

**사용자 게시글 리스트 페이지**

- 게시글 디테일 페이지에서 작성자 닉네임이나 댓글 리스트의 작성자 닉네임을 클릭하면 이동합니다.
- 해당 사용자가 작성한 게시글들을 볼 수 있습니다.

**글작성**

- 링크 삽입, 사진 업로드, 동영상 업로드, html 코드로 작성하기가 가능합니다.

**게시글 디테일 페이지**

- 댓글쓰기, 추천, 비추, 게시글 스크랩이 가능합니다.

**마이페이지**

- 정보 수정, 내가 작성한 게시글, 댓글, 스크랩한 게시글 등을 확인하고 관리할 수 있습니다

**알림**

- 내 게시글에 댓글이 달리거나 내 댓글에 답글이 달리면 상단 알림 아이콘에 숫자가 증가합니다. 클릭하면 내 알림 리스트를 무한스크롤로 불러옵니다.


# 서비스 화면

### 메인
![image](https://user-images.githubusercontent.com/57217119/178132853-ef48f374-3a43-4982-a321-2f9d9b3614bf.png)

### 게시글 리스트
![image](https://user-images.githubusercontent.com/57217119/178132875-d1b1f729-dbc6-42f7-8726-17801ac8bca7.png)

### 게시글 디테일
![image](https://user-images.githubusercontent.com/57217119/178132884-1a380d74-6898-4fd3-985b-785af9b5a266.png)


### 특정 사용자 게시글 리스트
![image](https://user-images.githubusercontent.com/57217119/178132895-1a07fbc4-8f74-4c51-a9e2-1c553db0fc8f.png)


### 게시글 작성
![image](https://user-images.githubusercontent.com/57217119/178132903-46958ef9-bd98-455b-b094-05445022f8c8.png)


### 알림
![image](https://user-images.githubusercontent.com/57217119/178132915-58b0fe55-1bbd-4d0d-b0b0-5fba1ba29169.png)


### 마이페이지
![image](https://user-images.githubusercontent.com/57217119/178132930-4c1a1c00-be55-4a44-b656-fae68c55b1b4.png)

---


## 폴더구조
![image](https://user-images.githubusercontent.com/57217119/172051849-93e294fa-8f06-46cd-b3e9-b54dc0b5693f.png)

 - app
> store가 있는 폴더

 - components
> 페이지별로 사용되는 컴포넌트 파일들이 들어있는 폴더

 - features
> 리덕스 툴킷과 관련된 파일들이 들어있음

 - hooks
 > 여러 컴포넌트에서 공통적으로 사용되는 함수들을 정의한 파일들이 들어있음
 
 - lib > api
 > 서버 api 요청 로직 분리

 - pages 
> 페이지단위로 렌더링되는 파일들을 모아둠

 - styles
> 모든 컴포넌트에 공통적으로 적용되는 GlobalStyle 파일과 여러 곳에서 사용되는 style을 정의한 theme 파일, 폰트 파일을 모아둠

 - types
> 사용되는 값의 타입들을 정의
