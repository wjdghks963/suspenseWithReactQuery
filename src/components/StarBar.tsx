import React from "react";
import styled from "styled-components";
import fillStar from "../assets/fill-star.svg";
import halfStar from "../assets/half-star.svg";
import lineStar from "../assets/line-star.svg";

export default function StarBar({
  name,
  rate,
  count,
}: {
  name?: string;
  rate: number;
  count: number;
}) {
  const starArr: number[] = [];

  for (let i = 0; i < 5; i++) {
    if (rate > 1) starArr.push(1);
    if (rate > 0 && rate < 1) starArr.push(0.5);
    if (rate < 0 || rate === 0) starArr.push(0);
    rate--;
  }

  return (
    <div title={name}>
      {starArr.map((i, index) => {
        switch (i) {
          case 1: {
            return <img key={index} src={fillStar} alt={"fill-star"} />;
          }
          case 0.5: {
            return <img key={index} src={halfStar} alt={"half-fill-star"} />;
          }
          default: {
            return <img key={index} src={lineStar} alt={"line-star"} />;
          }
        }
      })}
      <ReviewCount>({count > 99 ? `99+` : `${count}`})</ReviewCount>
    </div>
  );
}

const ReviewCount = styled.span`
  margin-left: 5px;
`;
