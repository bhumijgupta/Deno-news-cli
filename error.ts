import { red, bold } from "https://deno.land/std/fmt/colors.ts";

export const displayHelpAndQuit = (error?: string): void => {
  if (!error) {
  } else if (error === "INVALID_KEY") {
    console.log(
      bold(red(`Error: Invalid API key. Use --config flag to set key`)),
    );
  } else console.log(bold(red(`Error: ${error}`)));
  console.log("Usage: news-cli [filters]\n");
  console.log("Optional filters:");
  console.log("   -h, --help\t\t Shows this help message and exits");
  console.log(
    "   -l, --latest\t\t If the flag is set, then news will be returned only from latest headlines",
  );
  console.log("   -q, --query\t\t Find news related to a specific keyword");
  console.log(
    "   -c, --category\t\t Find news in a valid category (only applicable if used with -l, --latest). The valid categories are: business, entertainment, general, health, science, sports, technology",
  );
  console.log(
    "   --config <API_KEY>\t\t Set API key for news API. The key can be recieved from https://newsapi.org/",
  );
  Deno.exit();
};
