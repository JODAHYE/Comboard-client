# 기본적인 게시판
> 기본적인 커뮤니티 게시판입니다.
> https://comboard.netlify.app

![image](https://user-images.githubusercontent.com/57217119/169643710-4cf18c74-3c42-4673-98cf-6490b1f08475.png)


## 🔧 사용기술

### front

-   React, Redux, Redux-toolkit, typescript
-   Styled-components

### Backend

-   Express
-   MongoDB(mongoose)
-   jsonwebtoken, bcrypt
-   cloudinary
-   깃허브: https://github.com/JODAHYE/Comboard-server


### 배포
 - client - netlify
 - backend - 헤로쿠



## ✨기능

-   로그인
    
    > 아이디와 비밀번호를 입력하여 간단한 로그인/회원 가입 카카오로 간편하게 로그인 가능(카카오 로그인 api)
    

-   메인
    
    > 메인 화면에서 게시판을 생성할 수 있습니다. 제목, 게시판 유형(공개/비밀), 게시판 사진 등을 입력 받아 생성합니다.
    
    > 게시판 리스트를 무한스크롤로 불러옵니다.
    
    > 암호가 설정된 비밀 게시판은 게시판 제목 검색을 통해 렌더링되며, 게시판 클릭 시 암호를 입력해야 해당 게시판의 게시글들을 볼 수 있습니다.
    


-   게시글 리스트 페이지
    
    > 사용자들이 작성한 게시글들을 한 페이지당 22개씩 페이지네이션 방식으로 불러옵니다. 게시글들을 최신순/조회순/추천순/댓글순으로 정렬해 불러올 수 있습니다.
    


-   게시글 작성 페이지
    
    > 링크 삽입, 사진 업로드, 동영상 업로드, html 코드로 작성하기가 가능합니다.
    

-   게시글 디테일 페이지
    
    > 댓글쓰기, 추천, 비추, 게시글 스크랩이 가능합니다.
    


-   마이페이지
    
    > 정보 수정, 내가 작성한 게시글, 댓글, 스크랩한 게시글 등을 확인하고 관리할 수 있습니다.
    

-   알림
    
    > 내 게시글에 댓글이 달리거나 내 댓글에 답글이 달리면 상단 알림 아이콘에 숫자가 증가합니다. 클릭하면 내 알림 리스트를 무한스크롤로 불러옵니다.


## 폴더구조
![image](https://user-images.githubusercontent.com/57217119/169642765-3d14abc4-cdb4-4a6d-bb5e-842bdaa2067e.png)


 - app
> store가 있는 폴더

 - components
> 페이지별로 사용되는 컴포넌트 파일들이 들어있는 폴더

 - features
> 리덕스 툴킷과 관련된 파일들이 들어있음

 - hooks
 > 여러 컴포넌트에서 공통적으로 사용되는 함수들을 정의한 파일들이 들어있음

 - pages 
> 페이지단위로 렌더링되는 파일들을 모아둠

 - styles
> 모든 컴포넌트에 공통적으로 적용되는 GlobalStyle 파일과 여러 곳에서 사용되는 style을 정의한 theme 파일, 폰트 파일을 모아둠

 - types
> 사용되는 값의 타입들을 정의
