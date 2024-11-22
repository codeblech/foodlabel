# Food Label Analyzer

A web application that analyzes food product labels and ingredients using AI to provide detailed nutritional insights and health recommendations.

## Features

- Extract product information from Blinkit URLs
- Analyze ingredients and nutritional content
- Provide detailed health insights and recommendations
- User-friendly interface with Material UI components
- Real-time analysis results with tabbed view

## Tech Stack

### Frontend
- React + Vite
- Material UI
- Tailwind CSS
- Radix UI Components

### Backend
- Flask
- Selenium for web scraping
- Google Gemini Pro AI
- Python 3.10+

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- Chrome WebDriver
- Google Gemini API key

## Installation

1. Clone the repository

2. Setup Backend:
- Install poetry
```
curl -sSL https://install.python-poetry.org | python3 -
```
- Install dependencies
```
poetry install
```
- Create .env file and add your credentials
```
GEMINI_API_KEY=your_api_key_here
CHROMEDRIVER_PATH=path_to_chromedriver
```

3. Setup Frontend:
```
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
poetry run flask run
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open http://localhost:5173 in your browser

## Usage

1. Enter a Blinkit product URL in the input field
2. Click "Analyze" to process the product
3. View the extracted information and nutritional analysis in the tabbed interface

## License

MIT

## Authors

- [codeblech](https://github.com/codeblech)
- [ciaokitty](https://github.com/ciaokitty)
- [Xeen76](https://github.com/Xeen76)
