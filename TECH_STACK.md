# Tech Stack Document

## API Service (Backend)

**Language & Runtime:**

-   **Node.js** with **TypeScript**

**Framework and Server:**

-   **Fastify** for handling HTTP requests.
    -   Fastify plugins used:
        -   `@fastify/cors` – Enables Cross-Origin Resource Sharing (CORS).
        -   `@fastify/formbody` – Parses form data.
        -   `@fastify/helmet` – Secures HTTP headers.
        -   `@fastify/jwt` – Provides JWT authentication features.
        -   `@fastify/sensible` – Adds useful utility methods and error handling.
        -   `@fastify/websocket` – Supports WebSocket connections.

**Database & ORM:**

-   **Prisma** as the ORM with:
    -   `prisma` – CLI and migration tooling.
    -   `@prisma/client` – Generated client library for database interactions.
    -   Post-install script runs `prisma generate` to setup Prisma client.

**Authentication & Additional Libraries:**

-   `@privy-io/server-auth` – Manages server-side authentication.
-   `moralis` – Likely used for blockchain interactions.
-   `viem` – For interacting with blockchain protocols.
-   `zod` – Schema validation.

**Scripts:**

-   **dev:** `nodemon api/server.ts` – Runs the server with automatic restarts.
-   **build:** `tsc` – Compiles TypeScript to JavaScript.
-   **postinstall:** `prisma generate` – Generates Prisma client code post dependency installation.

## App Service (Frontend)

**Framework & Language:**

-   **Next.js** (version 14.2.3) – Provides server-side rendering and routing capabilities.
-   **React** – Core library for building UIs.
-   **TypeScript** – Static typing for improved development experience.

**User Interface & Styling:**

-   **Radix UI** – A collection of unstyled, accessible UI components. Components in use include:
    -   Accordion, Alert Dialog, Aspect Ratio, Avatar, Checkbox, Collapsible, Context Menu, Dialog, Dropdown Menu, Hover Card, Label, Menubar, Navigation Menu, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Slot, Switch, Tabs, Toast, Toggle, Toggle Group, Tooltip.
-   **Tailwind CSS** – Utility-first CSS framework.
-   **Sass** – For writing maintainable and modular CSS.
-   **PostCSS** (`postcss-import`) – Enables importing CSS files.
-   **Additional Styling Tools:**
    -   `tailwind-merge` – Merges Tailwind CSS classes.
    -   `tailwindcss-animate` – Utility for animations.

**Form Handling & Validation:**

-   **react-hook-form** – For managing form state.
-   **@hookform/resolvers** – Integrates schema validation with react-hook-form.

**Authentication & Blockchain:**

-   `@privy-io/react-auth` – Manages client-side authentication.
-   `ethers` – Library for blockchain interactions.
-   `viem` – Additional library for blockchain functionality.

**Utilities & Other Dependencies:**

-   Libraries such as:
    -   `clsx` – Utility for conditional classNames.
    -   `cmdk` – Command menu component.
    -   `date-fns` – Date utility library.
    -   `embla-carousel-react` – Carousel component library.
    -   `input-otp` – For handling OTP input.
    -   `jsonwebtoken` and `@types/jsonwebtoken` – For handling JWT tokens.
    -   `lucide-react` – Icon library.
    -   `react-day-picker` – Component for date selection.
    -   `react-markdown` – Markdown renderer.
    -   `react-resizable-panels` – Layout panels.
    -   `recharts` – Charting library.
    -   `remark-gfm` – Markdown extension for GitHub flavored markdown.
    -   `sonner` – Notification library.
    -   `valtio` – State management.
    -   `vaul` – Additional state or utility toolkit.

**Dev Tools:**

-   **ESLint** with `eslint-config-next` and plugins,
-   **TypeScript** for static type checking.
