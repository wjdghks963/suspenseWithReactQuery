import React, { useEffect, useContext, useState } from "react";
import styled, { css } from "styled-components";
import { InputContext } from "../store/InputContext";
import useDebounce from "../utils/useDebounce";

export default function SearchBar() {
  const { query, setQuery } = useContext(InputContext);
  const [inputValue, setInputValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const debounceValue = useDebounce(inputValue, 500);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(debounceValue), 500);
    return () => clearTimeout(timer);
  }, [debounceValue]);

  const inputChanging = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setInputValue("");
  };

  useEffect(() => {
    const scroll = () => {
      return window.pageYOffset === 0
        ? setIsScrolled(false)
        : setIsScrolled(true);
    };
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, []);

  return (
    <Wrapper title="searchbar" isScrolled={isScrolled}>
      <SVG>
        <path
          d="M13 13L10.1 10.1M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z"
          stroke="#090A0A"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SVG>
      <Input
        type="text"
        placeholder="검색"
        onChange={(e) => inputChanging(e)}
        value={inputValue}
      />
      {inputValue && (
        <DeleteSVG onClick={clearInput}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 6.00001L6.00004 10M6.00004 6.00001L10 10M14.6667 8.00001C14.6667 11.6819 11.6819 14.6667 8.00004 14.6667C4.31814 14.6667 1.33337 11.6819 1.33337 8.00001C1.33337 4.31811 4.31814 1.33334 8.00004 1.33334C11.6819 1.33334 14.6667 4.31811 14.6667 8.00001Z"
              stroke="#72777A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </DeleteSVG>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ isScrolled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 17px 25px 33px 25px;
  background-color: #f2f4f5;
  height: 36px;
  border-radius: 8px;
  position: sticky;
  top: 5px;

  ${(props) =>
    props.isScrolled &&
    css`
      box-shadow: 3px 8px 3px #696969;
    `}
`;

const SVG = styled.svg`
  fill: none;
  width: 16px;
  height: 16px;
  margin: 0px 10px;
`;

const DeleteSVG = styled.button``;

const Input = styled.input`
  border: none;
  background-color: transparent;
  width: 90%;
`;
