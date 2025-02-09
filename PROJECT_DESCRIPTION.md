# Project Build and Implementation Details

This document explains the nitty-gritty of how the project was built, the technologies used, and how everything was pieced together to form a cohesive system.

---

## Overview

The project is structured into two main components:
- **API (Backend)**
- **App (Frontend)**

Each component has been carefully designed and built to leverage modern frameworks, libraries, and partner technologies to deliver a scalable, secure, and efficient application.

---

## API (Backend)

**Built With:**
- **Node.js and TypeScript:** The API is developed using Node.js, and TypeScript ensures type safety and easier maintenance.
- **Fastify Framework:** Chosen for its high-performance HTTP handling, Fastify forms the backbone of our API. We made use of multiple Fastify plugins:
  - **@fastify/cors:** to handle cross-origin requests.
  - **@fastify/formbody:** for form data parsing.
  - **@fastify/helmet:** to secure HTTP headers.
  - **@fastify/jwt:** to provide JWT-based authentication seamlessly.
  - **@fastify/sensible:** which adds additional utilities for error handling and responses.
  - **@fastify/websocket:** to enable real-time communication where necessary.

**Database and ORM:**
- **Prisma ORM:** Prisma is used for interacting with the database, offering a type-safe query builder and migration system. The integration is streamlined with an automatic client generation as part of the post-install script.

**Authentication and Blockchain Integration:**
- **@privy-io/server-auth:** This partner technology was integrated to manage authentication, ensuring a secure backend. Its flexibility was particularly beneficial when combined with other modern authentication methods.
- **Moralis, Viem, and Zod:** These libraries were used to handle blockchain interactions and schema validation. They ensure that any blockchain-related functionality is reliably implemented and validated.

**Notable Hacky Details:**
- There were moments when integrating blockchain functionalities, especially while combining traditional REST endpoints with blockchain data, required some creative workarounds. For instance, bridging asynchronous blockchain state with Fastify’s synchronous flow was a challenge, and we solved it using custom middleware that caches blockchain responses.
- The usage of Fastify’s ecosystem allowed rapid prototyping. The post-install Prisma generation ensured that any schema changes were instantly applied, enforcing a tight feedback loop during development.

---

## App (Frontend)

**Built With:**
- **Next.js and React:** The frontend is built using Next.js—providing server-side rendering, static optimizations, and excellent routing—together with React to create interactive UI components.
- **TypeScript:** Used throughout the frontend for consistency and maintainability.
- **Tailwind CSS and Sass:** Tailwind CSS offers utility-first styling, while Sass is used for more modular and maintainable custom styles. Both work together to ensure a responsive and modern UI.
- **Radix UI Components:** A suite of unstyled yet highly accessible UI components was integrated, allowing rapid development of complex components such as accordions, dialog boxes, and tab systems without compromising on accessibility.
- **Utility Libraries:** 
  - **clsx, cmdk, date-fns, and others** were included to handle various UI conveniences such as class name merging, command menu interactions, and date manipulation.
  - **Plugin Ecosystem:** Tools like `tailwind-merge` and `tailwindcss-animate` further refined the UI design.

**Authentication and Blockchain in the Frontend:**
- **@privy-io/react-auth:** Partner technology that handles client-side authentication. It seamlessly integrates with the backend’s authentication logic.
- **Ethers and Viem:** Provide the necessary tools for interacting with blockchain data where required by the app.

**Notable Hacky Details:**
- Some of the UI components, particularly those handling dynamic layouts and real-time interactions, required bespoke enhancements. For example, blending Next.js’s SSR capabilities with client-side blockchain interactions mandated careful state synchronization.
- Integration between Radix UI components and Tailwind CSS was optimized by creating custom utility classes, ensuring consistency across various modules and responsive behavior on different devices.

---

## Integration and Architecture

- **Modular Design:** The clear separation into `api/` and `app/` directories supports a microservices-like architecture, enabling independent development and deployment cycles.
- **Partner Technologies:** Using partner solutions like @privy-io for authentication and Moralis for blockchain interactions allowed us to leverage specialized functionalities without having to build them from scratch. This not only saved time but also enhanced the overall security and reliability of the system.
- **Tooling and Workflow:** The development workflow was automated using scripts defined in the `package.json` files. Running tests, building TypeScript code, and integrating Prisma’s migration system ensured that the codebase remained robust during iterative development.

---

## Conclusion

In summary, the project is a culmination of modern web development best practices combined with innovative use of partner technologies. The backend leverages Fastify and Prisma to deliver a robust API, while the frontend utilizes Next.js, React, and Tailwind for a dynamic and responsive interface. Strategic use of hacky yet effective solutions in asynchronous flows and blockchain integrations allowed for a seamless user experience, making the project both powerful and future-proof.
