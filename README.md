# Git Analyzer

## Summary

Project is about fetching specific information on files and commits from GitHub, and use LLM to check their quality.

Technical stack: 
- Typescript
- NextJS
- TailwindCSS
- Octokit for GitHub API connections
- Google AI SDK
- Jest
- Prettier, Husky
- Render

## Setup and run locally

In production
```
npm run build && npm run start
```

In development mode
```
npm i && npm run dev
```

To run the application correctly, create a ```.env.local``` file in the project's root directory and add the following variables:
```
GITHUB_TOKEN=your_generated_github_token
GEMINI_API_KEY=your_generated_gemini_api_key
```

## Web page

Link to the web page:

https://git-quality-checker.onrender.com/

_Note: Initial loading may take 2-3 minutes. Refresh the page if necessary._

You may experience delays or failures when analyzing files/commits individually due to API rate limits or processing time. If this occurs, please try again after 20-30 seconds or reload the page.
