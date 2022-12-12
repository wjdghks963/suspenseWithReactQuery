import React from "react";
import styled, { keyframes } from "styled-components";
import lineStar from "../assets/line-star.svg";

export default function SkeletonTourPost({
  count,
  direction,
}: {
  count: number;
  direction: string;
}) {
  const postCountArr = new Array(count).fill("1");

  const starArr = [1, 1, 1, 1, 1];

  return (
    <UIWrapper direction={direction}>
      {postCountArr.map((i, index) => (
        <Wrapper key={index}>
          <PostImage />
          <PostContent>
            <PostTitle />
            <PostDesc />
            <StarBar>
              {starArr.map((_, i) => (
                <img key={i} src={lineStar} alt="line-star" />
              ))}
            </StarBar>
            <svg
              width="20"
              height="18"
              viewBox="0 0 24 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.8401 3.61C20.3293 3.099 19.7229 2.69364 19.0554 2.41708C18.388 2.14052 17.6725 1.99817 16.9501 1.99817C16.2276 1.99817 15.5122 2.14052 14.8447 2.41708C14.1772 2.69364 13.5708 3.099 13.0601 3.61L12.0001 4.67L10.9401 3.61C9.90837 2.57831 8.50909 1.99871 7.05006 1.99871C5.59103 1.99871 4.19175 2.57831 3.16006 3.61C2.12837 4.64169 1.54877 6.04097 1.54877 7.5C1.54877 8.95903 2.12837 10.3583 3.16006 11.39L4.22006 12.45L12.0001 20.23L19.7801 12.45L20.8401 11.39C21.3511 10.8792 21.7564 10.2728 22.033 9.60535C22.3095 8.93789 22.4519 8.22249 22.4519 7.5C22.4519 6.77751 22.3095 6.0621 22.033 5.39464C21.7564 4.72718 21.3511 4.12075 20.8401 3.61V3.61Z"
                stroke="#979C9E"
                fill="transparent"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </PostContent>
        </Wrapper>
      ))}
    </UIWrapper>
  );
}

const skeletonAnim = keyframes`
    0% {
        background-color: rgba(165, 165, 165, 0.1);
    }

    50% {
        background-color: rgba(165, 165, 165, 0.3);
    }

    100% {
        background-color: rgba(165, 165, 165, 0.1);
    }
`;

const UIWrapper = styled.div<{ direction: string }>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  gap: 33px;
`;

const Wrapper = styled.div`
  display: flex;
  margin: 0 16px;
`;

const PostImage = styled.div`
  width: 92px;
  height: 120px;
  border-radius: 10px;
  background-color: #e3e5e5;
  animation: ${skeletonAnim} 1s infinite ease-in-out;
`;

const PostContent = styled.div`
  width: 70vw;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-top: 5px;

  svg {
    margin-top: auto;
    margin-left: auto;
  }
`;

const PostTitle = styled.span`
  width: 30%;
  height: 16px;
  font-weight: 700;
  font-size: 18px;
  border-radius: 9px;
  background-color: #e3e5e5;
  animation: ${skeletonAnim} 1s infinite ease-in-out;
`;

const PostDesc = styled.span`
  width: 80%;
  height: 16px;
  margin-top: 4px;
  border-radius: 9px;
  background-color: #e3e5e5;
  animation: ${skeletonAnim} 1s infinite ease-in-out;
`;

const StarBar = styled.div``;
