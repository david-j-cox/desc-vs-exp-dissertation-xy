# Choice Experiment

A web-based experiment platform built with Next.js for conducting choice-based behavioral research.

## Features

- Multi-phase experiment workflow
- Forced trials with image stimuli
- Blue-orange choice trials
- Comprehensive final survey
- Automatic data collection and OSF integration
- Real-time feedback and point tracking

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/components` - React components for different experiment phases
- `/pages` - Next.js pages and routing
- `/public` - Static assets and images
- `/styles` - CSS and styling files

## Data Collection

Experiment data is automatically collected and can be uploaded to OSF (Open Science Framework) through the `/data` endpoint.

## Development

This project uses:
- Next.js for the frontend framework
- Tailwind CSS for styling
- TypeScript for type safety
- pnpm for package management