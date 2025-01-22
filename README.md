# Git Analyzer

## Summary

Project is about fetching specific information on files and commits from GitHub, and use LLM to check their quality.

Technical stack: 

[![Stack](https://skillicons.dev/icons?i=ts,nextjs,tailwind,ai,jest)](https://skillicons.dev)

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

https://git-analyzer-it.vercel.app
