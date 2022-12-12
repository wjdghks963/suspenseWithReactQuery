import React from "react";
import styled from "styled-components";

export default function ErrorPage() {
  const forceReloadPage = () => window.location.reload();

  return (
    <Wrapper>
      <ErrorMessage>오류가 발생했습니다.</ErrorMessage>
      <ReloadBtn onClick={forceReloadPage}>새로 고침</ReloadBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ErrorMessage = styled.span`
  font-weight: 800;
  margin-bottom: 30px;
  font-size: 20px;
`;

const ReloadBtn = styled.button`
  border: 2px solid black;
  border-radius: 5px;
  padding: 8px;
`;
