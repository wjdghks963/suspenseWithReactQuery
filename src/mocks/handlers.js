import { rest } from "msw";
import attractions from "./attractions.json";

const LIKES_STORAGE_KEY = "__triple_frontend_assignment_mock_api_key__likes";

export const handlers = [
  rest.get("/api/attractions", async (req, res, ctx) => {
    const query = req.url.searchParams.get("query");
    const likes = JSON.parse(sessionStorage.getItem(LIKES_STORAGE_KEY) || "{}");

    const filteredAttractions = query
      ? filterAttractionsWithQuery(attractions, query)
      : attractions;
    const isLikedAddedAttractions = filteredAttractions.map((attraction) => ({
      ...attraction,
      like: {
        isLiked: likes[attraction.id] ?? false,
        count: attraction.like.count + (likes[attraction.id] ? 1 : 0),
      },
    }));

    if (process.env.NODE_ENV !== "test") {
      await sleep(800);
    }

    return res(ctx.status(200), ctx.json(isLikedAddedAttractions));
  }),
  rest.put("/api/attractions/:attractionId/like", async (req, res, ctx) => {
    const { attractionId } = req.params;
    const likes = JSON.parse(sessionStorage.getItem(LIKES_STORAGE_KEY) || "{}");

    likes[attractionId] = true;

    sessionStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));

    if (process.env.NODE_ENV !== "test") {
      await sleep(400);
    }

    return res(ctx.status(204));
  }),
  rest.delete("/api/attractions/:attractionId/like", async (req, res, ctx) => {
    const { attractionId } = req.params;
    const likes = JSON.parse(sessionStorage.getItem(LIKES_STORAGE_KEY) || "{}");

    likes[attractionId] = false;

    sessionStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));

    if (process.env.NODE_ENV !== "test") {
      await sleep(400);
    }

    return res(ctx.status(204));
  }),
];

function filterAttractionsWithQuery(attractions, query) {
  return attractions.filter((attraction) => attraction.name.includes(query));
}

async function sleep(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
