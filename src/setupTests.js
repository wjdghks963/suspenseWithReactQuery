import "@testing-library/jest-dom";
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => {
  sessionStorage.clear();
  server.resetHandlers();
});
afterAll(() => server.close());
