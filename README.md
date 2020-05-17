<p align="center"><img src="https://github.com/bhumijgupta/Deno-news-cli/raw/master/assets/banner.png" alt="DALP logo"/></p>
<p align="center">Find your quick news byte at your terminal.</p>

## Installation

You can download the executable directly from GitHub.

```
deno install --allow-net --allow-read --allow-write -n news-cli https://raw.githubusercontent.com/bhumijgupta/Deno-news-cli/master/mod.ts
```

## Setup

1. Create you free account on [https://newsapi.org/](https://newsapi.org/).
2. Run the command to set your api key
   ```
   news-cli --config <API_KEY>
   ```
3. Run the following command to get more info

```
   news-cli --help
```

## Usage

```
Optional filters:
   -h, --help		 Shows this help message and exits
   -l, --latest		 If the flag is set, then news will be returned only from latest headlines
   -q, --query		 Find news related to a specific keyword
   -c, --category		 Find news in a valid category (only applicable if used with -l, --latest). The valid categories are: business, entertainment, general, health, science, sports, technology
   --config <API_KEY>		 Set API key for news API. The key can be recieved from https://newsapi.org/
```

## To Do

- Colorise output
