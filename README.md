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

To run application properly you have to ```.env.local``` file in the root of the project. In this file add:
```
GITHUB_TOKEN=your_generated_github_token
GEMINI_API_KEY=your_generated_gemini_api_key
```

## Web page

Link to the web page:

https://git-quality-checker.onrender.com/

(Might be some troubles with launch, try to open and refresh the page in 2-3 minutes)

Also you might face some issues with analyzing file/commit one by one. This is happening because API couldn't process the requests so fast. Try again in 20-30 seconds or reload the page.
