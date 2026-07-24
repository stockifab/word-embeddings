import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./schema";

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.DEV ? "http://localhost:8000" : "",
});
export const $api = createClient(fetchClient);
