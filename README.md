# Coin Label Generator (Barcode App)

A specialized full-stack application for generating physical inventory labels for raw coins. This app features a real-time visual preview and generates precise **2-inch x 1-inch PDFs** optimized for thermal printers (e.g., Zebra, Dymo, Rollo).

## Features

* **Dual-Layer Rendering:**
    * **Frontend:** React-based visual preview for instant feedback.
    * **Backend:** High-precision PDF generation (via `PDFKit`) ensuring exact physical dimensions (2" x 1") and 300 DPI resolution.
* **Unique ID Generation:** Server-side reservation system (e.g., `JCG-183044176`) to prevent duplicates.
* **Industry Standard Barcodes:** Generates Code 128 barcodes using `bwip-js`.
* **Type Safety:** Monorepo structure with shared TypeScript definitions between Client and Server.

##  Tech Stack

* **Frontend:** React, Vite, TypeScript, React Hook Form, React Barcode.
* **Backend:** Node.js, Express, TypeScript, PDFKit, BWIP-JS.
* **Shared:** Common TypeScript interfaces for strict contract adherence.

---

## Getting Started

### Prerequisites

* **Node.js** (v18 or higher)
* **npm** (comes with Node.js)

### 1. Installation

This project is structured as a monorepo. You need to install dependencies for both the `server` and the `client`.

**Root Directory:**
```bash
# Clone the repository
git clone <your-repo-url>
cd barcode-label-app
```

**Install Backend:**

```bash
cd server
npm install
cd ..
```

**Install Frontend:**

```bash
cd client
npm install
cd ..
```

### 2. Running the Application

You will need to run two separate terminals to start the full stack.

**Terminal 1: Start the Backend (Port 4000)**

```bash
cd server
npm run dev
```

> You should see: `Server running on http://localhost:4000`

**Terminal 2: Start the Frontend (Port 5173)**

```bash
cd client
npm run dev
```

> You should see a local URL, typically `http://localhost:5173`

## Usage Guide

1.  **Open the Frontend URL** in your browser.
2.  **Auto-ID:** A unique ID (e.g., `JCG-...`) is automatically reserved and displayed.
3.  **Fill Details:** Enter the Coin Year, Denomination, and Mint Mark.
4.  **Preview:** Watch the label preview update in real-time on the right.
5.  **Print:** Click "Print Label".
    *   A PDF will generate and open in a new tab.
    *   This PDF is sized exactly **2 inches x 1 inch**.
6.  **Select your Thermal Printer** in the system print dialog and print.

##  Project Structure

```text
barcode-label-app/
├── client/              # React Frontend
│   ├── src/
│   │   ├── App.tsx      # Main UI Logic
│   │   └── App.css      # Styles
│   └── tsconfig.app.json # Includes reference to shared types
│
├── server/              # Node.js Backend
│   ├── src/
│   │   └── index.ts     # API Routes & PDF Generation Logic
│   └── package.json
│
└── shared/              # Shared Code
    └── types.ts         # TypeScript Interfaces (CoinLabelData)
```

