import { IArticle } from "./types.d.ts";

class Api {
  readonly #baseURL: string = "https://newsapi.org/v2/";
  #apiKey: string = "";

  constructor(apikey: string) {
    this.#apiKey = apikey;
  }

  getNews = async (
    latest: boolean | undefined,
    category: string | undefined,
    query: string | undefined,
  ): Promise<IArticle[] | string> => {
    let additional: string = "";
    if (category) additional += `&category=${category}`;
    if (query) additional += `&q=${encodeURI(query)}`;
    if (latest === undefined || latest === false) {
      additional += "&sortBy=popularity";
    }
    try {
      const rawResult = await fetch(
        `${this.#baseURL}${
          latest ? "top-headlines" : "everything"
        }?language=en&pageSize=10${additional}&apiKey=${this.#apiKey}`,
      );
      const result = await rawResult.json();
      if (result.status === "error") return "INVALID_KEY";
      let news: IArticle[] = result.articles;
      return news;
    } catch (err) {
      return "Cannot connect to server. Please check your internet connection";
    }
  };
}

export default Api;
