# Project overview

Use this guide to build a web app where users can give a text prompt to generate emoji using a model hosted on Replicate.  

## Feature requirements

- We will use Next.js, Shadcn, Lucid, Supabase, Clerk  
- Create a form where users can put in a prompt, and clicking on a button that calls the Replicate model to generate an emoji  
- Have a nice UI & animation when the emoji is blank or generating  
- Display all the images ever generated in a grid  
- When hovering over each emoji image, an icon button for download and an icon button for like should be shown up  

## Relevant docs

xxx

## How to use replicate to make Emojies

Set the REPLICATE_API_TOKEN environment variable

export REPLICATE_API_TOKEN=r8_ON1**********************************

Visibility

Copy
Learn more about authentication

Install Replicate’s Node.js client library

npm install replicate

Copy
Learn more about setup
Run fofr/sdxl-emoji using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    prompt: "A TOK emoji of a man",
    apply_watermark: false
};

const output = await replicate.run("fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e", { input });

import { writeFile } from "node:fs/promises";
for (const [index, item] of Object.entries(output)) {
  await writeFile(`output_${index}.png`, item);
}
//=> output_0.png written to disk
xxx  

## Current File structure

app/
  ├── components/         # Shared components
  │   ├── ui/            # Basic UI components
  │   ├── layout/        # Layout components
  │   └── features/      # Feature-specific components
  │
  ├── lib/               # Utility functions and shared logic
  │   ├── utils/         # Helper functions
  │   └── types/         # TypeScript type definitions
  │
  ├── styles/            # Global styles and Tailwind utilities
  │
  ├── (routes)/          # Route groups
  │   ├── (auth)/        # Authentication related pages
  │   └── (dashboard)/   # Dashboard related pages
  │
  ├── api/               # API routes
  │   └── [...]/         # API endpoints
  │
  └── hooks/             # Custom React hooks

## Rules

All new componets should go in the /componets and be named like examole-component.tsx unless otherwiese specified
all new pages should go in /app

xxx
