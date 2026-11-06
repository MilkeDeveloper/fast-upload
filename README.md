# Fast Upload

A video upload web interface built with Next.js and React. The project explores the user experience around selecting a video, previewing it, tracking upload progress, and generating a link to share the uploaded content.

## Features

- Select videos by clicking or dragging and dropping a file.
- Validate selected files as video media.
- Preview a selected video before upload.
- Display upload progress and confirmation/error dialogs.
- Submit the video to an upload API, then register its metadata to generate a shareable watch URL.
- Provide a sharing flow for the resulting link.

## Tech stack

- Next.js 15 (App Router)
- React 19 and TypeScript
- Tailwind CSS and Radix UI
- Axios
- Sonner notifications

## Getting started

Requirements: Node.js, npm, and the API services used by the upload flow.

```bash
git clone --branch dev https://github.com/MilkeDeveloper/fast-upload.git
cd fast-upload
npm install
npm run dev
```

Open http://localhost:3000.

## API configuration

The frontend references these public environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:YOUR_API_PORT
NEXT_PUBLIC_FAST_UPLOAD_URL=http://localhost:3000
```

Replace these example values with your own service URLs. The application expects backend endpoints including `POST /upload` (file upload) and `POST /videos` (video metadata registration). The backend is not provided by this frontend README.

Do not place private API keys or credentials in `NEXT_PUBLIC_*` variables; those values are exposed to browsers.

## Implementation notes

The main upload flow is in `src/app/upload/page.tsx`. The code includes drag-and-drop handling, video preview, upload progress, and API calls. The metadata-saving request is currently invoked without awaiting its completion, so the end-to-end share-link flow should be tested and hardened before production use.

## Status

Personal project / work in progress. The README describes the implementation visible in the repository; it does not claim a deployed or production-ready service.

## Author

[MilkeDeveloper](https://github.com/MilkeDeveloper)
