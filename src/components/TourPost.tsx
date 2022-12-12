import React, { useContext } from "react";
import styled from "styled-components";
import { InputContext } from "../store/InputContext";
import HeartBox from "./HeartBox";
import StarBar from "./StarBar";

export default function TourPost({ data }: { data: TourPostData }) {
  const { query } = useContext(InputContext);

  const hightIndex = (query: string, name: string): Map<string, string> => {
    const map = new Map<string, string>();
    if (query === "") return map.set("normal", data.name);

    const matchIndex = name.indexOf(query);

    const first = name.slice(0, matchIndex);
    const match = name.slice(matchIndex, query.length + matchIndex);
    const last = name.slice(matchIndex!! + query.length, name.length);

    if (first !== "") map.set("first", first);
    if (last !== "") map.set("last", last);
    map.set("match", match);

    return map;
  };

  const map = hightIndex(query, data.name);

  return (
    <Wrapper>
      <PostImage alt={`${data.name} 썸네일`} src={data.coverImageUrl} />
      <PostContent>
        <PostTitle>
          {map?.get("first") && <span>{map.get("first")}</span>}
          {map?.get("match") && (
            <PostTitleHighlight>{map.get("match")}</PostTitleHighlight>
          )}
          {map?.get("last") && <span>{map.get("last")}</span>}
          {map?.get("normal") && data.name}
        </PostTitle>
        <PostDesc>{data.description}</PostDesc>
        <StarBar
          name={data.name}
          rate={data.reviews.averageRating}
          count={data.reviews.count}
        />
        <HeartBox data={data} />
      </PostContent>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
`;

const PostImage = styled.img`
  width: 92px;
  height: 120px;
  border-radius: 10px;
`;

const PostContent = styled.div`
  width: 70vw;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-top: 5px;
`;

const PostTitle = styled.div`
  display: flex;
  flex-direction: row;
  font-weight: 700;
  font-size: 18px;
  color: #090a0a;
  width: 60vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PostTitleHighlight = styled.strong`
  color: #0065d0;
`;

const PostDesc = styled.span`
  margin-top: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #404446;
`;
