#!/usr/bin/env -S deno --allow-net --allow-read=./news-cli.json --allow-write=./news-cli.json
// ***************
// IMPORTS
// ***************
import { parse, Args } from "https://deno.land/std/flags/mod.ts";
import { readJsonSync } from "https://deno.land/std/fs/read_json.ts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { writeJsonSync } from "https://deno.land/std/fs/write_json.ts";
import { green, bold } from "https://deno.land/std/fmt/colors.ts";
import { displayHelpAndQuit } from "./error.ts";
import Api from "./api.ts";
import { IArticle, IConfigFile } from "./types.d.ts";
// ***************
// FUNCTIONS
// ***************

const setApiKey = (parsedArgs: Args): void => {
  if (typeof parsedArgs.config === "string") {
    if (!existsSync("./news-cli.json")) {
      Deno.createSync("./news-cli.json");
    }
    writeJsonSync("./news-cli.json", { apiKey: parsedArgs.config });
    console.log(`${green(bold("Success"))} ApiKey set Successfully`);
    displayHelpAndQuit();
  } //   Handling if apiKey is not present after --config
  else displayHelpAndQuit("Config flag should be followed by apiKey");
};

const getApiKey = (): any => {
  try {
    let file = readJsonSync("./news-cli.json");
    if (typeof file === "object" && file !== null) {
      //   TODO: add custom type guard
      let configFile = file as IConfigFile;
      if (configFile.apiKey) return configFile.apiKey;
      else displayHelpAndQuit("apiKey not found in the config file ");
    }
  } catch (err) {
    displayHelpAndQuit("Config file not present. Use --config to set apiKey");
  }
};

const invalidFlags = (parsedArgs: Args): string | null => {
  const validFlags: Set<string> = new Set([
    "_",
    "c",
    "category",
    "latest",
    "l",
    "query",
    "q",
  ]);
  let keys = Object.keys(parsedArgs);
  if (
    (parsedArgs.c || parsedArgs.category) &&
    parsedArgs.l === undefined &&
    parsedArgs.length === undefined
  ) {
    return "Category filter can only be used in conjunction with latest";
  }
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    if (!validFlags.has(key)) return `Found invalid flag ${key}`;
    if (
      (key === "query" || key === "q") &&
      typeof parsedArgs[key] !== "string"
    ) {
      return `Found invalid value for flag ${key}`;
    }
    if (
      (key === "category" || key === "c") &&
      invalidCategory(parsedArgs[key])
    ) {
      return `Found invalid value for flag ${key}`;
    }
    if (
      (key === "latest" || key === "l") &&
      typeof parsedArgs[key] !== "boolean"
    ) {
      return `Found invalid value for flag ${key}`;
    }

    if (key == "_" && parsedArgs._.length > 0) {
      return `Found invalid flag ${parsedArgs._[0]}`;
    }
  }
  return null;
};

const displayBanner = (): void => {
  console.clear();
  console.log(`
███╗   ██╗███████╗██╗    ██╗███████╗     ██████╗██╗     ██╗
████╗  ██║██╔════╝██║    ██║██╔════╝    ██╔════╝██║     ██║
██╔██╗ ██║█████╗  ██║ █╗ ██║███████╗    ██║     ██║     ██║
██║╚██╗██║██╔══╝  ██║███╗██║╚════██║    ██║     ██║     ██║
██║ ╚████║███████╗╚███╔███╔╝███████║    ╚██████╗███████╗██║
╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚══════╝     ╚═════╝╚══════╝╚═╝
\nFind your quick news byte at your terminal. Powered by News API\n
`);
};

const displayArticles = (news: IArticle[]): void => {
  if (news.length === 0) console.log("No results found");
  news.forEach((article: IArticle, i: number) => {
    console.log(`  ${i + 1}\t${article.title}`);
    if (article.description) console.log(`\t${article.description}`);
    if (article.url) console.log(`\tMore info: ${article.url}\n`);
  });
};

const invalidCategory = (category?: string): boolean => {
  if (category === undefined) return true;
  const validCategories: Set<string> = new Set([
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ]);
  return !validCategories.has(category);
};

// ***************
// Main method
// ***************
if (import.meta.main) {
  const { args } = Deno;
  const parsedArgs = parse(args);
  displayBanner();
  //   If option to set API Key
  if (parsedArgs.config) setApiKey(parsedArgs);
  //   Check for API key
  let apiKey: string = getApiKey();
  const apiClient: Api = new Api(apiKey);
  //   Check if all flags are valid
  let error = invalidFlags(parsedArgs);
  if (error) {
    displayHelpAndQuit(error);
  }
  // If no args are passed
  if (args.length == 0 || parsedArgs.h || parsedArgs.help) displayHelpAndQuit();
  else {
    let latest = parsedArgs.latest || parsedArgs.l;
    let category = parsedArgs.category || parsedArgs.c;
    let query = parsedArgs.query || parsedArgs.q;
    let news = await apiClient.getNews(latest, category, query);
    displayArticles(news);
  }
}
