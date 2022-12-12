import React, { Suspense, useState } from "react";
import PostList from "./components/PostList";
import SearchBar from "./components/SearchBar";
import { InputContext } from "./store/InputContext";
import SkeletonTourPost from "./components/SkeletonTourPost";
import ErrorBoundary from "./components/ErrorBoundary";
import ErrorPage from "./components/ErrorPage";
import styled from "styled-components";

export default function App() {
  const [query, setQuery] = useState<string>("");

  return (
    <Wrapper>
      <InputContext.Provider value={{ query, setQuery }}>
        <SearchBar />
        <Suspense
          fallback={<SkeletonTourPost count={3} direction={"column"} />}
        >
          <ErrorBoundary fallback={<ErrorPage />}>
            <PostList />
          </ErrorBoundary>
        </Suspense>
      </InputContext.Provider>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
