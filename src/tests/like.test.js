import { render, waitFor, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestProvider from "./TestProvider";
import App from "../App";

const fillHeartImgMatcher = (content, element) =>
  content === "img" && element.getAttribute("src") === "fill-heart.svg";
const lineHeartImgMatcher = (content, element) =>
  content === "img" && element.getAttribute("src") === "line-heart.svg";
const likeButtonMatcher = (content, element) =>
  content === "button" &&
  within(element).queryByRole(lineHeartImgMatcher) !== null;
const unlikeButtonMatcher = (content, element) =>
  content === "button" &&
  within(element).queryByRole(fillHeartImgMatcher) !== null;

test("좋아요 버튼을 누르면 관광지를 좋아요합니다.", async () => {
  const user = userEvent.setup();
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  await waitFor(() => {
    screen.getByText("카오산 로드");
  });

  const likeButton = screen.getAllByRole(likeButtonMatcher)[0];

  expect(likeButton).toBeDefined();

  await user.click(likeButton);

  await waitFor(() => {
    within(likeButton).getByRole(fillHeartImgMatcher);
  });
});

test("좋아요한 버튼을 누르면 관광지 좋아요를 취소합니다.", async () => {
  const user = userEvent.setup();
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  await waitFor(() => {
    screen.getByText("카오산 로드");
  });

  const likeButton = screen.getAllByRole(likeButtonMatcher)[0];

  expect(likeButton).toBeDefined();

  await user.click(likeButton);

  await waitFor(() => {
    within(likeButton).getByRole(fillHeartImgMatcher);
  });

  await user.click(likeButton);

  await waitFor(() => {
    within(likeButton).getByRole(lineHeartImgMatcher);
  });
});

test("API를 호출하여 좋아요, 좋아요 취소 상태를 새로고침에도 반영합니다.", async () => {
  const user = userEvent.setup();

  const actionAndUnmount = async (action) => {
    const { unmount } = await waitForFetch();

    const beforeImgMatcher =
      action === "like" ? lineHeartImgMatcher : fillHeartImgMatcher;
    const afterImgMatcher =
      action === "unlike" ? fillHeartImgMatcher : lineHeartImgMatcher;

    const likeButton = screen.getAllByRole(
      (content, element) =>
        content === "button" && within(element).queryByRole(beforeImgMatcher)
    )[0];

    expect(likeButton).toBeDefined();

    await user.click(likeButton);

    await waitFor(() => {
      within(likeButton).getByRole(afterImgMatcher);
    });

    unmount();
  };

  await actionAndUnmount("like");
  await actionAndUnmount("unlike");

  await waitForFetch();

  expect(screen.queryAllByRole(unlikeButtonMatcher)).toHaveLength(0);
});

async function waitForFetch() {
  const utils = render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  await waitFor(() => {
    screen.getByText("카오산 로드");
  });

  return utils;
}
