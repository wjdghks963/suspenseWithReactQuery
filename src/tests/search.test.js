import {
  render,
  renderHook,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useQuery } from "react-query";
import App from "../App";
import TestProvider from "./TestProvider";

const fetchFn = async (keyword) => {
  const res = await fetch(`/api/attractions?query=${keyword}`);
  const json = await res.json();
  return json;
};

test("검색 영역을 렌더링합니다.", async () => {
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  const searchArea = screen.getByTitle("searchbar");
  within(searchArea).getByRole("textbox");
});

test("검색 인풋에 값을 입력합니다.", async () => {
  const user = userEvent.setup();
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  const input = within(screen.getByTitle("searchbar")).getByRole("textbox");

  await user.click(input);
  await user.keyboard("foo");

  expect(input).toHaveValue("foo");
});

test("검색 인풋에 값을 입력하면 검색어를 한 번에 제거하는 버튼을 표시합니다.", async () => {
  const user = userEvent.setup();
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );
  const searchArea = screen.getByTitle("searchbar");
  const input = within(searchArea).getByRole("textbox");

  await user.click(input);
  await user.keyboard("foo");

  const clearButton = within(searchArea).getByRole("button");

  await user.click(clearButton);

  expect(input).toHaveValue("");
});

test("검색 인풋에서 엔터를 입력하면 검색 결과를 표시합니다.", async () => {
  const user = userEvent.setup();

  // for search bar & postlist
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  // for react-query useQuery hook
  const wrapper = ({ children }) => <TestProvider>{children}</TestProvider>;

  await waitFor(() => {
    screen.getByAltText("카오산 로드 썸네일");
  });

  const input = within(screen.getByTitle("searchbar")).getByRole("textbox");

  await user.click(input);

  await user.type(input, "카오산{enter}");

  const inputValue = input.getAttribute("value");

  // render hook for react-query useQuery
  const { result: QueryHookResult } = renderHook(
    () =>
      useQuery({ queryKey: ["PostData"], queryFn: () => fetchFn(inputValue) }),
    { wrapper }
  );

  await waitFor(() => expect(QueryHookResult.current.isSuccess).toBe(true));

  expect(screen.getByAltText("카오산 로드 썸네일")).toBeInTheDocument();

  await waitFor(() => {
    screen.getByAltText("카오산 로드 썸네일");
  });

  await waitFor(() =>
    expect(screen.queryByAltText("투몬 비치 썸네일")).not.toBeInTheDocument()
  );
});

test("검색 인풋에 값을 입력하기만 해도 검색 결과를 표시합니다.", async () => {
  const user = userEvent.setup();
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  const wrapper = ({ children }) => <TestProvider>{children}</TestProvider>;

  await waitFor(() => {
    screen.getByAltText("카오산 로드 썸네일");
  });
  const input = within(screen.getByTitle("searchbar")).getByRole("textbox");
  await user.click(input);
  await user.type(input, "ㅋ");

  const { result: QueryHookResult } = renderHook(
    () =>
      useQuery({
        queryKey: ["PostData"],
        queryFn: () => fetchFn(input.getAttribute("value")),
      }),
    { wrapper }
  );

  await waitFor(() => expect(QueryHookResult.current.isSuccess).toBe(true));

  const promise = waitForElementToBeRemoved(() =>
    screen.queryByAltText("카오산 로드 썸네일")
  );

  console.log(await promise);

  await user.keyboard("{backspace}카오산");
  await promise;

  const { result: QueryHookResult2 } = renderHook(
    () =>
      useQuery({
        queryKey: ["PostData"],
        queryFn: () => fetchFn(input.getAttribute("value")),
      }),
    { wrapper }
  );

  await waitFor(() => expect(QueryHookResult2.current.isSuccess).toBe(true));

  await waitFor(() => {
    screen.getByAltText("카오산 로드 썸네일");
  });

  expect(screen.queryByAltText("투몬 비치 썸네일")).not.toBeInTheDocument();
});

test("검색 결과의 관광지 이름에서 검색어를 하이라이트합니다.", async () => {
  const user = userEvent.setup();
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );
  const wrapper = ({ children }) => <TestProvider>{children}</TestProvider>;

  await waitFor(() => {
    screen.getByAltText("카오산 로드 썸네일");
  });
  const input = within(screen.getByTitle("searchbar")).getByRole("textbox");
  await user.click(input);

  await user.keyboard("카오산{Enter}");

  const { result: QueryHookResult } = renderHook(
    () =>
      useQuery({
        queryKey: ["PostData"],
        queryFn: () => fetchFn(input.getAttribute("value")),
      }),
    { wrapper }
  );

  // await waitFor(() => expect(QueryHookResult.current.isLoading).toBe(true));
  // expect(screen.queryByAltText("카오산 로드 썸네일")).not.toBeInTheDocument();

  await waitFor(() => expect(QueryHookResult.current.isSuccess).toBe(true));

  await waitFor(() =>
    expect(screen.queryByAltText("투몬 비치 썸네일")).not.toBeInTheDocument()
  );

  await waitFor(() => {
    screen.getByAltText("카오산 로드 썸네일");
  });
  const query = screen.getByText("카오산");

  expect(query.tagName).toEqual("STRONG");

  expect(query).toHaveStyle("color: #0065D0");
}, 10000);
