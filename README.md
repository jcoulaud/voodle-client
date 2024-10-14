![BETA Badge](https://img.shields.io/badge/status-BETA-yellow)
![APACHE 2.0 License](https://img.shields.io/badge/license-APACHE%202.0-green.svg)
[![X Follow](https://img.shields.io/twitter/follow/JulienCoulaud?style=social)](https://twitter.com/JulienCoulaud)

# Voodle: Crypto trading platform on TON blockchain (Frontend)

This is the frontend repository for Voodle, a trading platform where users can create strategies to automatically buy and sell tokens on the TON blockchain, without the need for technical knowledge.

## Disclaimer

This is my first time open-sourcing a project, so I appreciate your patience as I work through any issues. Since I didn't originally plan to open-source this, the code could be better documented and cleaned up. Improvements are on the way!

The frontend and backend are separated into two repositories:

- [Frontend](https://github.com/jcoulaud/voodle-client)
- [Backend](https://github.com/jcoulaud/voodle-server)

## Status: Working

### Some known issues

- The frontend design needs to be improved.
- Some components may not be fully responsive.
- Error handling and user feedback could be enhanced.

## Features

- User authentication with magic link
- Strategy management interface
- Transaction history view
- Wallet integration

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with Tailwind UI components and Headless UI
- **State Management**: React Context API
- **API Communication**: Apollo Client (GraphQL)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18.17.1 or later)
- pnpm

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/jcoulaud/voodle-client.git
   cd voodle-client
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the development server:

   ```
   pnpm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

6. Start the backend:

   To run the backend application, please refer to the [Voodle Backend Repository](https://github.com/jcoulaud/voodle-server) for installation and setup instructions.

## Project Structure

- `src/`:
  - `app/`: Next.js 14 app directory
    - `(authenticated)/`: Routes that require authentication
    - `auth/`: Authentication-related pages (login, verify)
    - `components/`: Shared components used across multiple pages
    - `lib/`: Utility functions, GraphQL queries/mutations, and configurations
    - `providers/`: React context providers
    - `styles/`: Global styles and Tailwind CSS configuration
  - `components/`: Reusable React components
  - `hooks/`: Custom React hooks
  - `types/`: TypeScript type definitions
  - `middleware.ts`: Next.js middleware for route protection and logging
- `public/`: Static assets (images, fonts, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [AGPLv3 license](./LICENSE) - see the [LICENSE](./LICENSE) file for details.
