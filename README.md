# Dotts 2

Dotts is a modern social platform that allows users to create, share, and discover content through a unique tagging system called "walls". Built with Nuxt 3 and Vue.js, it offers a clean, responsive interface for meaningful content sharing.

## Features

- **Rich Text Editor**: Create posts with formatted text, lists, quotes, and more
- **Wall System**: Organize and discover content through customizable tags/walls
- **Follow System**: Follow specific walls to curate your personal feed
- **Link Sharing**: Share and preview links within posts
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Instant feed updates when new content is posted
- **User Authentication**: Secure login and registration system
- **Masonry Layout**: Beautiful, Pinterest-style content layout

## Tech Stack

- **Frontend**: Nuxt 3, Vue.js 3, UnoCSS
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL
- **Editor**: EditorJS
- **UI Components**: Custom components with Tailwind-like utilities

## Prerequisites

- Node.js 16.x or higher
- NPM or other package manager (Yarn, PNPM, Bun)
- Supabase account and project

## Environment Setup

Create a `.env` file in the root directory with the following variables:
SUPABASE_PUBLIC_API_BASE=your_supabase_url
SUPABASE_PUBLIC_ANON=your_supabase_anon_key
SUPABASE_API_SECRET=your_supabase_service_role_key
ANNOUNCEMENT=optional_announcement_message## Installation

1. Clone the repository:

git clone https://github.com/yabodo/dotts-2.git
cd dotts-2

2. Install dependencies:

npm install

3. Run development server:

npm run dev

4. Build for production:

npm run build

5. Preview production build:

npm run preview

## Project Structure

- `layouts/`: Page layouts and navigation components
- `pages/`: Application routes and page components
- `components/`: Reusable Vue components
- `composables/`: Shared composition functions
- `utils/`: Utility functions and helpers
- `public/`: Static assets
- `assets/`: Stylesheets and other assets requiring processing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the Proprietary License. All rights reserved. Unauthorized copying, distribution, or modification of this project is strictly prohibited.

## Contact

- Website: [https://240616-dotts.vercel.app/](https://240616-dotts.vercel.app/)
- Support via Github user Yabodo

## Acknowledgments

- Built with [Nuxt 3](https://nuxt.com)
- Database powered by [Supabase](https://supabase.com)
- Editor powered by [EditorJS](https://editorjs.io)
