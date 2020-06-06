import { red, bold, cyan } from "./deps.ts";

export const displayHelpAndQuit = (error?: string): void => {
  if (!error) {
  } else if (error === "INVALID_KEY") {
    console.log(
      bold(red(`Error: Invalid API key. Use --config flag to set key`)),
    );
  } else console.log(bold(red(`Error: ${error}`)));
  console.log(`Usage: news-cli [filters]\n`);
  console.log(`Optional flags:`);
  console.log(`   ${bold("-h, --help")}\t\t Shows this help message and exits`);
  console.log(
    `   ${
      bold(
        "-l, --latest",
      )
    }\t\t If the flag is set, then news will be returned only from latest headlines`,
  );
  console.log(
    `   ${bold("-q, --query")}\t\t Find news related to a specific keyword`,
  );
  console.log(
    `   ${
      bold(
        "-c, --category",
      )
    }\t Find news in a valid category (only applicable if used with -l, --latest).\n\t\t\t The valid categories are: business, entertainment, general, health, science, sports, technology`,
  );
  console.log(
    `   ${
      bold(
        "--config <API_KEY>",
      )
    }\t Set API key for news API. The key can be received from ${
      cyan(
        `https://newsapi.org/register`,
      )
    }`,
  );
  Deno.exit();
};
