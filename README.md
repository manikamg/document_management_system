# Document Management System

A modern React-based document management system for uploading, organizing, searching, and managing documents with features like tagging, PDF viewing, and file type filtering.

## Features

- **User Authentication**: Secure login and registration system
- **User Authentication with mobile number and otp verification**: User can send and resend OTP for login process
- **Document Upload**: Upload documents with support only IMAGE and PDF file types
- **Document Search**: Search documents by category, name/department, from date, to date and tags
- **PDF Viewing**: Built-in PDF viewer for viewing documents
- **Tag Management**: Organize documents with customizable tags
- **File Type Filtering**: Filter documents by file type (PDF, DOCX, images, etc.)
- **Download & Export**: Download individual documents or batch export as ZIP

## Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **State Management**: Redux Toolkit 2.11.2
- **Routing**: React Router DOM 7.13.0
- **UI Framework**: React Bootstrap 2.10.10 + Bootstrap 5.3.8
- **HTTP Client**: Axios 1.13.5
- **PDF Handling**: pdfjs-dist 5.4.296, react-pdf 10.3.0
- **File Operations**: file-saver 2.0.5, jszip 3.10.1
- **Icons**: react-icons 5.5.0
- **Notifications**: react-toastify 11.0.5

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd document_management_system
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
Start the development server with hot reload:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
Build the application for production:
```bash
npm run build
```
The optimized build will be in the `dist` folder.

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

## Testing

Currently, no test framework is configured for this project. To add testing:

1. Install a testing framework (e.g., Vitest, Jest):
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

2. Add test scripts to `package.json`:
```json
"test": "vitest",
"test:coverage": "vitest --coverage"
```

3. Create test files with `.test.jsx` or `.spec.jsx` extension in your project.

## Project Structure

```
document_management_system/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Static assets (images, etc.)
│   ├── components/        # Reusable React components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   └── ui/            # UI components (Card, Icon)
│   ├── features/          # Feature-based modules
│   │   ├── auth/          # Authentication features
│   │   ├── document/      # Document management features
│   │   └── tag/           # Tag management features
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page components
│   │   ├── auth/          # Login, Register pages
│   │   ├── dashboard/     # Dashboard page
│   │   └── document/      # Document pages (Upload, Search)
│   ├── routes/            # Routing configuration
│   ├── services/          # API services
│   │   ├── api/           # API client (Axios)
│   │   └── mock/          # Mock data for development
│   ├── store/             # Redux store configuration
│   │   └── slices/        # Redux slices
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## API Configuration

The application uses mock data by default. To connect to a real backend:

1. Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:3000/api
```

2. Update the API configuration in `src/services/api/axios.js`

## License

MIT

