import { tavily as Tavily } from "@tavily/core";

interface SearchParams {
  query: string;
}

interface TavilyResponse {
  results: Array<{
    title: string;
    url: string;
    content: string;
    score?: number;
  }>;
}

const tavily = Tavily({
  apiKey: process.env.TAVILY_API_KEY as string,
});

export const searchInternet = async (
  { query }: SearchParams
): Promise<TavilyResponse> => {
  if (!query) {
    throw new Error("Query is required");
  }

  const response = await tavily.search(query, {
    maxResults: 5,
    searchDepth: "advanced",
  });

  return response as TavilyResponse;
};