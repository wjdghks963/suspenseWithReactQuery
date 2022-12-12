import { render, screen, waitFor, within } from "@testing-library/react";
import App from "../App";
import HeartBox from "../components/HeartBox";
import TestProvider from "./TestProvider";

test("관광지 목록을 표시합니다.", async () => {
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  await waitFor(() => {
    screen.getByText("카오산 로드");
  });

  screen.getByText("카오산 로드");
  screen.getByText("투몬 비치");
  screen.getByText("에펠탑");
  screen.getByText("한 시장");
  screen.getByText("민트 장난감 박물관");
  screen.getByText("플리 런던 빈티지 앤 메이커스 마켓");
  screen.getByText("스프링 스튜디오");
  screen.getByText("왓 위쑨나랏");
  screen.getByText("시티 모스크");
  screen.getByText("화산 1914 문화 창의 산업원구");
});

test("관광지의 평점과 리뷰 개수를 확인할 수 있습니다.", async () => {
  render(
    <TestProvider>
      <App />
    </TestProvider>
  );

  await waitFor(() => {
    screen.getByText("카오산 로드");
  });

  [
    ["카오산 로드", [3, 1, 1, "(99+)"]],
    ["투몬 비치", [4, 1, 0, "(99)"]],
    ["에펠탑", [2, 1, 2, "(99+)"]],
    ["한 시장", [2, 1, 2, "(42)"]],
    ["민트 장난감 박물관", [2, 1, 2, "(6)"]],
    ["플리 런던 빈티지 앤 메이커스 마켓", [0, 0, 5, "(0)"]],
    ["스프링 스튜디오", [0, 1, 4, "(2)"]],
    ["시티 모스크", [3, 1, 1, "(59)"]],
    ["화산 1914 문화 창의 산업원구", [4, 1, 0, "(3)"]],
  ].forEach(
    ([title, [fillStarCount, halfStarCount, emptyStarCount, textContent]]) => {
      const ratingElement = screen.getByTitle(title);

      expect(
        within(ratingElement)
          .queryAllByRole("img")
          .filter((img) => img.getAttribute("src") === "fill-star.svg")
      ).toHaveLength(fillStarCount);
      expect(
        within(ratingElement)
          .queryAllByRole("img")
          .filter((img) => img.getAttribute("src") === "half-star.svg")
      ).toHaveLength(halfStarCount);
      expect(
        within(ratingElement)
          .queryAllByRole("img")
          .filter((img) => img.getAttribute("src") === "line-star.svg")
      ).toHaveLength(emptyStarCount);
      expect(ratingElement).toHaveTextContent(textContent);
    }
  );
});

describe("관광지를 좋아요한 사용자 수를 표시합니다.", () => {
  [
    ["30402개의 좋아요", "999+"],
    ["0개의 좋아요", "0"],
    ["8개의 좋아요", "8"],
    ["999개의 좋아요", "999"],
  ].forEach(([title, textContent]) => {
    it(`${title}`, () => {
      const countLike = title.split("개")[0];
      const data = { like: { count: +countLike } };

      render(
        <TestProvider>
          <HeartBox data={data} />
        </TestProvider>
      );

      const btn = screen.getAllByRole("button").find((btn) => btn);

      expect(btn).toBeDefined();

      expect(btn).toHaveTextContent(textContent);
    });
  });
});
