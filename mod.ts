#!/usr/bin/env -S deno --allow-net --allow-read --allow-write --allow-env
// ***************
// IMPORTS
// ***************
import {
  parse,
  Args,
  readJsonSync,
  existsSync,
  writeJsonSync,
  green,
  bold,
  cyan,
  yellow,
  magenta,
} from "./deps.ts";
import { displayHelpAndQuit } from "./error.ts";
import Api from "./api.ts";
import { IArticle, IConfigFile } from "./types.d.ts";
// ***************
// FUNCTIONS
// ***************

const setApiKey = (parsedArgs: Args): void => {
  let homeEnv: string | undefined = Deno.env.get("HOME");
  let home: string = "";
  if (typeof homeEnv === "string") home = homeEnv;
  else home = ".";
  let configFilePath: string = `${home}/.news-cli.json`;
  if (typeof parsedArgs.config === "string") {
    if (!existsSync(configFilePath)) {
      Deno.createSync(configFilePath);
    }
    writeJsonSync(configFilePath, { apiKey: parsedArgs.config });
    console.log(`${green(bold("Success"))} ApiKey set Successfully`);
    displayHelpAndQuit();
  } //   Handling if apiKey is not present after --config
  else displayHelpAndQuit("Config flag should be followed by apiKey");
};

const getApiKey = (): any => {
  let homeEnv: string | undefined = Deno.env.get("HOME");
  let home: string = "";
  if (typeof homeEnv === "string") home = homeEnv;
  else home = ".";
  let configFilePath: string = `${home}/.news-cli.json`;
  try {
    let file = readJsonSync(configFilePath);
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
\n${
    bold(
      green("Find your quick news byte at your terminal."),
    )
  } Powered by News API\n
${yellow("Contribute at: https://github.com/bhumijgupta/Deno-news-cli")}\n
`);
};

const showFlags = (parsedArgs: Args): void => {
  let flagToName: Map<string, string> = new Map([
    ["l", "latest"],
    ["q", "query"],
    ["c", "category"],
  ]);
  let flagsInfo: string[] = [];
  Object.keys(parsedArgs).forEach((arg) => {
    if (arg !== "_") {
      let argName = flagToName.has(arg) ? flagToName.get(arg) : arg;
      flagsInfo.push(`${green(`${argName}: `)}${parsedArgs[arg]}`);
    }
  });
  console.log(`Getting news by- \t${flagsInfo.join("\t")}\n`);
};

const displayArticles = (news: IArticle[]): void => {
  if (news.length === 0) {
    console.log(magenta(`Uh Oh! Looks like we cannot find any news`));
  }
  news.forEach((article: IArticle, i: number) => {
    console.log(bold(magenta(`   ${i + 1}\t${article.title}`)));
    if (article.description) console.log(`\t${article.description}`);
    if (article.url) {
      console.log(cyan(`${bold(`\tMore info:`)} ${article.url}\n`));
    }
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

  showFlags(parsedArgs);

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
    let newsResponse = await apiClient.getNews(latest, category, query);
    if (typeof newsResponse === "object") displayArticles(newsResponse);
    else displayHelpAndQuit(newsResponse);
  }
}
