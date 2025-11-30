# Gemini Vision OCR Migration (Full Stack)

Migrate to a full-stack architecture to securely host the Gemini Vision API integration on Railway.

## User Review Required
> [!IMPORTANT]
> **Architecture Change**: We are adding a Node.js/Express backend (`/server`) to handle API requests.
> **Deployment**: The app will now be deployed as a single service where the backend serves the frontend static files.
> **Security**: The API Key will be stored securely in Railway's environment variables, never exposed to the client.

## Proposed Changes

### Backend (New)
#### [NEW] [server/index.js](file:///Users/oui/Wutcharin/server/index.js)
- Express server.
- Endpoint: `POST /api/analyze`.
- Handles image upload (multer) and calls Gemini API.
- Serves static files from `../dist` in production.

#### [NEW] [server/package.json](file:///Users/oui/Wutcharin/server/package.json)
- Dependencies: `express`, `cors`, `dotenv`, `multer`, `@google/generative-ai`.

### Frontend
#### [MODIFY] [InteractiveOCR.tsx](file:///Users/oui/Wutcharin/src/components/ocr/InteractiveOCR.tsx)
- Remove Tesseract.js.
- Send image file to `/api/analyze`.
- Display structured response from backend.

#### [MODIFY] [vite.config.ts](file:///Users/oui/Wutcharin/vite.config.ts)
- Add proxy for `/api` to `http://localhost:3000` for local development.

### Root Configuration
#### [MODIFY] [package.json](file:///Users/oui/Wutcharin/package.json)
- Add `start` script: `node server/index.js` (for Railway).
- Add `dev:full` script to run both frontend and backend.

## Verification Plan
### Local Verification
- Run backend and frontend.
- Upload image -> Frontend sends to Backend -> Backend calls Gemini -> Result displayed.
### Deployment Prep
- Ensure `npm run build` creates the `dist` folder that the server expects.

## 3. Design Aesthetics
- **Theme**: "Cyber-Industrial" / "Lab" aesthetic.
- **Colors**: High-contrast Black & White base with "Terminal Green" and "Bounding Box Red/Blue" accents.
- **Typography**: Monospace fonts for code and technical data; Bold Sans-serif for headers.
- **Animations**: `framer-motion` for smooth entry, scanning effects, and data visualization.

## 4. Implementation Steps
1.  **Refactor Main App** (Done): Split `App.tsx` into `Home.tsx` and setup Routing.
2.  **Create Page Structure** (In Progress): Build the skeleton of `PaddleOCRPage.tsx`.
3.  **Build Interactive Demo Component**: Create the simulated scanning experience.
4.  **Add Technical Content**: Populate with real code snippets and pipeline explanations.
5.  **Polish & SEO**: Ensure responsive design and proper meta tags.
