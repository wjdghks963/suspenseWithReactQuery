import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { InputContext } from "../store/InputContext";
import TourPost from "./TourPost";

const fetchFn = async (keyword: string) => {
  const res = await fetch(`/api/attractions?query=${keyword}`);
  const json = await res.json();
  return json;
};

export default function PostList() {
  const { query } = useContext(InputContext);

  const { data } = useQuery(["PostData", query], () => fetchFn(query), {
    suspense: true,
  });

  return (
    <Wrapper>
      {data?.map((postData: TourPostData) => (
        <TourPost key={postData.id} data={postData} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  gap: 33px;
`;
