# 📊 Finboard Finance

A modern, customizable financial dashboard built with Next.js for real-time data visualization and API integration.

![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## ✨ Features

- **🎨 Customizable Widgets**: Create card, table, and chart widgets with flexible configurations
- **📡 API Integration**: Connect to any REST API endpoint with JSON path data extraction
- **🎯 Field Selection**: Choose specific data fields from API responses to display
- **💱 Data Formatting**: Format data as currency, percentage, decimal, or integer
- **📊 Multiple Display Modes**:
  - **Card**: Display single values with large, readable text
  - **Table**: Show tabular data with full column and row support
  - **Chart**: Visualize time-series data with line charts
- **🔄 Auto-Refresh**: Configurable refresh intervals for real-time updates
- **📱 Responsive Grid**: Drag-and-drop, resizable widgets with react-grid-layout
- **💾 Persistent State**: Widgets and layouts saved to localStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/maaz1604/FinBoard.git
cd finboard
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎮 Usage

### Creating Widgets

1. Click the **Add Widget** button in the navbar
2. Configure your widget:
   - **Title**: Give your widget a descriptive name
   - **Description**: Add optional context or notes
   - **API URL**: Enter the REST API endpoint
   - **Display Mode**: Choose Card, Table, or Chart
   - **Data Key**: Specify the JSON path to your data (e.g., `data.price`)
   - **Format**: Select currency, percentage, decimal, or integer formatting
   - **Refresh Interval**: Set auto-refresh rate (10s to 5min)

### Field Selection

For Table and Card modes:
- Browse **Available Fields** from the API response
- Use the search bar to filter fields
- Click **→** to add fields to **Selected Fields**
- Click **←** to remove fields
- Toggle **Show arrays only** to filter array data for tables

### Widget Management

- **Drag**: Click and drag the header to reposition
- **Resize**: Drag the bottom-right corner handle
- **Delete**: Click the X button in the widget header
- **Edit Mode**: Toggle to lock/unlock widgets

## 🏗️ Project Structure

```
finboard/
├── app/
│   ├── globals.css         # Global styles and Tailwind imports
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Main dashboard page
├── components/
│   ├── AddWidgetModal.tsx  # Widget creation modal
│   ├── DashboardGrid.tsx   # Grid layout container
│   ├── WidgetCard.tsx      # Individual widget renderer
│   └── charts/
│       └── StockLineChart.tsx  # Chart visualization
├── lib/
│   ├── apiClient.ts        # API fetching and caching
│   └── mockData.ts         # Mock data generators
├── store/
│   └── useDashboardStore.ts  # Zustand state management
├── types/
│   └── index.ts            # TypeScript type definitions
└── public/
    └── favicon.svg         # App icon
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Grid Layout**: [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 👨‍💻 Author
**Maaz Amir**  
GitHub: [@maaz1604](https://github.com/maaz1604)

## 📝 API Integration Example

### Basic Card Widget
```json
API: https://api.example.com/stock/AAPL
Response: {
  "data": {
    "price": 150.25,
    "change": 2.5
  }
}
Data Key: data.price
Format: Currency
```

### Table Widget
```json
API: https://api.example.com/portfolio
Response: {
  "holdings": [
    { "symbol": "AAPL", "shares": 10, "value": 1502.50 },
    { "symbol": "GOOGL", "shares": 5, "value": 725.00 }
  ]
}
Data Key: holdings
Display Mode: Table
```
