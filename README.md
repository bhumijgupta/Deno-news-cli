<p align="center"><img src="https://github.com/bhumijgupta/Deno-news-cli/raw/master/assets/banner.png" alt="News CLI ASCII art"/></p>
<p align="center">Find your quick news byte at your terminal.</p>

## Installation

You can download the executable directly from GitHub.

```
deno install --allow-net --allow-read --allow-write --allow-env -n news-cli https://raw.githubusercontent.com/bhumijgupta/Deno-news-cli/master/mod.ts
```

## Features

- Get news headline
- Get news by category
- Get news including a keyword
- Search for news from international sources

## Example

Running `news-cli -latest -c technology -q Google` will give output:

<p align="center"><img src="https://github.com/bhumijgupta/Deno-news-cli/raw/master/assets/screenshot.png" alt="Screenshot"/></p>

## Setup

1. Create you free account on [https://newsapi.org/](https://newsapi.org/).
2. Run the command to setup your api key
   ```
   news-cli --config <API_KEY>
   ```
3. Run the following command to get more info
   ```
      news-cli --help
   ```

## Usage

Run `news-cli` in your terminal followed by any of the filters

```
Optional filters:
   -h, --help		 Shows this help message and exits
   -l, --latest		 If the flag is set, then news will be returned only from latest headlines
   -q, --query		 Find news related to a specific keyword
   -c, --category		 Find news in a valid category (only applicable if used with -l, --latest). The valid categories are: business, entertainment, general, health, science, sports, technology
   --config <API_KEY>		 Set API key for news API. The key can be received from https://newsapi.org/
```

## Linting

The project uses Deno's inbuilt formatter. You can manually lint code using

```
deno fmt
```

## Author

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

### Bhumij Gupta

![GitHub followers](https://img.shields.io/github/followers/bhumijgupta?label=Follow&style=social) [![LinkedIn](https://img.shields.io/static/v1.svg?label=connect&message=@bhumijgupta&color=success&logo=linkedin&style=flat&logoColor=white)](https://www.linkedin.com/in/bhumijgupta/) [![Twitter URL](https://img.shields.io/twitter/url?style=social&url=http%3A%2F%2Ftwitter.com%2Fbhumijgupta)](https://twitter.com/bhumijgupta)

---

```javascript
if (repo.isAwesome || repo.isHelpful) {
  StarRepo();
}
```
