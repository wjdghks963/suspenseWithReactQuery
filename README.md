# react query를 이용한 suspense 사용 

## 구현 과정

1. App
   App에서 전역으로 사용할 state를 context api를 이용합니다.
   Serach bar와 데이터를 받아오는 post list 컴포넌트를 분리했기 떄문에 클라이언트 사이드에서 전역으로 쿼리를 관리합니다.

2. SearchBar
   검색이 가능한 input입니다.
   디바운스를 이용해 과도한 리렌더링과 api 요청을 막습니다.
   디바운스가 끝난 상태값을 query state에 set합니다

3. PostList
   post들에 대한 정보를 받는 Wrapper입니다.
   데이터 패칭을 받는 곳이고 post들을 관리합니다.

4. TourPsot
   개별 post에 대한 정보를 나타냅니다.
   하트와 별점 component를 분리했습니다.

5. StarBar
   TourPost에 들어가 있는 별점 컴포넌트입니다.
   데이터에 대한 정보(이름, 별점, 리뷰 수)를 props로 받고 svg를 이용해 별점을 나타냅니다.

6. HeartBox
   TourPost에 들어가 있는 하트 컴포넌트입니다.
   데이터를 props를 받아 svg로 하트를 표현합니다.
   만약 좋아요를 누른다면 해당 요청이 끝날때까지 기다리다 요청에 대한 응답이 성공할 시 데이터를 refetch합니다.

7. SkeletonTourPost
   TourPost의 스켈레톤 UI입니다.
   다른 곳에서 쓰일 경우를 생각해 갯수, flex-direction을 props로 받아 표현할 수 있게 만들었습니다.

8. ErrorBoundary
   suspense의 데이터 패칭 결과가 error를 반환한다면 fallback을 반환하는 컴포넌트를 구현했습니다.
   현재 error를 잡는 `componentDidCatch` 함수가 class 형 컴포넌트에서만 적용이 가능하기 때문에 class형으로 구현되었습니다.
   console로 에러에 대한 로그를 알려주고 props로 받은 fallback을 반환합니다.

9. ErrorPage
   ErrorBoundary에 fallback으로 들어가는 에러를 알려주는 컴포넌트입니다.
   버튼을 누르면 window reload가 실행됩니다.

## 사용한 라이브러리

스타일 : styled-components

props에 따라 css 변경에 사용하기 쉽운점, css-in-js로 파일관리가 따로 필요없고 태그를 수정하기 빠르다는 점 때문에 선택했습니다.

서버 상태 관리 : react-query

캐시로 데이터를 저장하고 서버에서 클라이언트로 내려오는 데이터와 캐싱된 데이터를 비교해 패치를 하지 않는 점에서 fetch를 최소화할 수 있는 점
devtool로 캐시된 데이터들을 상태와 함께 볼 수 있다는 점
react 18 suspense를 사용하기 위해선 promise를 복잡한 로직으로 만들어야하는데 react query에서 suspense를 지원해주는 점
data, isLoading, error 등 다양한 테이터 fetch 결과 상태에 대한 값을 반환해 주는 점

위와 같은 장점들 때문에 선택했습니다.

타입 체크 : typescript

런타임 에러로 부터의 안정성, 데이터를 사용할 때나 라이브러리의 method를 사용할 때 자동완성을 위해 사용했습니다.

## 선택 요구사항

1. 좋아요 / 좋아요 취소 버튼을 눌렀을 때 인터랙션

좋아요 : 투명해졌다 빨간색으로 바뀌는 애니메이션
취소 : 크기가 왼쪽으로 가며 작아지고 빨간색으로 바뀌는 애니메이션

2. API가 오류를 반환했을 때 처리

ErrorBoundary로 데이터가 에러를 반환하면 fallback에 담긴 컴포넌트를 반환합니다.
window를 새로고침 하는 ErrorPage 컴포넌트를 만들었습니다.

3. 사용자가 의도하지 않은 행동을 할 때 방어 UI

input의 디바운스로 사용자가 과도한 입력을 했을 때 query를 바꿔 요청하는 부분을 막았습니다.
하트를 클릭하는 이벤트에서 mutate가 일어날때 로딩 중이면 클릭해도 요청을 막아 과도한 요청이 일어나지 않도록 했습니다.

## Test code 바꾼점

react query provider로 테스트 컴포넌트를 감싸기 위해 TestProvider.tsx를 만들었습니다.
test에서 render 시작할때 Provider로 감싸줍니다.

### attraction.test.js

2번째 test case: 관광지의 평점과 리뷰 개수를 확인할 수 있습니다.

fetch 받은 title을 맞게 찾고 해당하는 데이터(별, 리뷰 수)에 맞게 배열을 수정했습니다.

3번째 test case : 관광지를 좋아요한 사용자 수를 표시합니다.

App이 아니라 관광지 좋아요를 표현하는 컴포넌트로 배열에 있는 값을 프롭스로 넣어 테스트 합니다.
jest에서 props를 테스트하기 위해 describe를 이용해 테스트 함수를 묶고 배열에 있는 테스트를 개별적으로 진행했습니다.

---

별점 component를 식별하기 위해서 props로 관광지 이름을 받아 title 속성으로 설정했습니다.

### search.test.js

useQuery hook을 사용하기 위해 QueryProvider로 감싸 사용할 수 있게 만들었습니다.
setQuery로 상태를 공유하는 것보다 테스트를 위해 텍스트만을 필요한 경우라 처음 render한 screen에서 input value를 가져오고 이 value를 기준으로 useQuery를 사용해 api 통신을 할 수 있게 했습니다.
결과값이 나오기까지 기다려야하기 때문에 await waitfor를 사용해 hook의 isSuccess가 true가 될때 까지 테스트를 대기 시켰습니다.

customhook이 컴포넌트에서 이용하지 않으면 안된다는 오류로 원라는 결과값이 다르다면 key값을 바꾸기 위해 useQuery가 담긴 renderhook을 다시 선언했습니다.

search bar의 input을 찾기 위해 component에 title="searchbar" property를 부여했습니다.
input을 찾을때 title과 role="textbox"로 찾습니다.

---

4번째 case : 검색 인풋에서 엔터를 입력하면 검색 결과를 표시합니다.

마지막 투몬 비치가 있는지 확인하는 expect는 처음 `카오산`을 검색했을 때 썸네일이 나와야하기 때문에 not을 제거하고 api의 결과를 기다려야하기 때문에 await waitfor를 사용해 기다린 후 결과를 받을 수 있게 했습니다.

5번째 case : 검색 인풋에 값을 입력하기만 해도 검색 결과를 표시합니다.

input에 "ㅋ"를 입력하는 것을 추가했습니다.
첫번째 ㅋ에 대한 결과값이 끝난 후 ㅋ를 지우고 카오산 을 input에 입력했습니다.

hook을 두번 사용해 query에 대한 결과값이 나오면 테스트가 실행되도록 만들었습니다.

6번째 case : 검색 결과의 관광지 이름에서 검색어를 하이라이트합니다.

로딩을 기다리는 로드산이 없어지길 기다리는 함수를 제거했습니다.
마지막 테스트는 제한 시간 10초를 주었습니다.
