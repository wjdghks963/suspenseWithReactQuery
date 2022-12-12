import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled, { keyframes } from "styled-components";
import { css } from "styled-components";
import fillHeart from "../assets/fill-heart.svg";
import lineHeart from "../assets/line-heart.svg";

const putHeart = async (id: string) => {
  await fetch(`/api/attractions/${id}/like`, {
    method: "PUT",
  });
};

const deleteHeart = async (id: string) => {
  await fetch(`/api/attractions/${id}/like`, {
    method: "DELETE",
  });
};

export default function HeartBox({ data }: { data: TourPostData }) {
  const queryClient = useQueryClient();

  const [clicked, setClicked] = useState<number>(3);

  const mutateFn = () => {
    return data.like.isLiked ? deleteHeart(data.id) : putHeart(data.id);
  };

  const { mutate, isLoading } = useMutation("putHeart", mutateFn, {
    onSuccess: () => {
      queryClient.invalidateQueries("PostData");
    },
  });

  const clickHeart = () => {
    if (!isLoading) mutate();

    switch (clicked) {
      case 1:
        return setClicked(0);
      case 0:
        return setClicked(1);
      case 3:
        return data.like.isLiked ? setClicked(1) : setClicked(0);
    }
  };

  return (
    <Wrapper onClick={() => clickHeart()} clicked={clicked}>
      <Count>{data.like.count > 1000 ? "999+" : data.like.count}</Count>
      {data.like.isLiked ? (
        <img alt="fill-heart" src={fillHeart} />
      ) : (
        <img alt="line-heart" src={lineHeart} />
      )}
    </Wrapper>
  );
}

const HeartAnimLike = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const HeartAnimeDeleteLike = keyframes`
  0% {
   width: 100%;
  }
  100% {
    width: 0%;
  }
`;

const Wrapper = styled.button<{ clicked: number }>`
  margin-top: auto;
  margin-left: auto;
  display: flex;
  cursor: pointer;

  ${(props) => {
    switch (props.clicked) {
      case 0:
        return css`
          img {
            animation: ${HeartAnimLike} 1s linear;
          }
        `;
      case 1:
        return css`
          img {
            animation: ${HeartAnimeDeleteLike} 1s linear;
          }
        `;
    }
  }}
`;

const Count = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #979c9e;
  margin-right: 5px;
  align-self: center;
`;
