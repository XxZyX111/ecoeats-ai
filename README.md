# EcoEats AI
An AI-powered web platform for predicting and reducing food waste in restaurants.

EcoEats AI helps restaurants make smarter, data-driven decisions about food preparation and inventory.  
Instead of relying on guesswork, the system forecasts food waste using machine learning and provides actionable recommendations through an AI assistant.

The goal is simple: reduce waste, lower costs, and operate more sustainably.

---

## Overview

Managing food inventory is one of the biggest operational challenges for restaurants.  
Overproduction leads to waste. Underproduction leads to shortages and unhappy customers.

EcoEats bridges this gap by combining time-series forecasting with an interactive AI assistant.  
It analyzes historical patterns, event types, dates, and guest counts to help teams prepare exactly what they need.

---

## Features

### AI-Powered Forecasting
Uses an LSTM-based time-series model to predict future food waste and demand trends.

### Conversational Assistant
Chat naturally with an AI assistant to:
- estimate preparation quantities
- understand waste spikes
- get optimization suggestions
- analyze historical performance

### File Attachments
Upload images, spreadsheets, and documents to provide context for smarter responses.

### Conversation History
All conversations are stored so you can revisit past insights and decisions.

### Theme Support
Light and dark modes for comfortable viewing.

### Secure Authentication
Email/password authentication powered by Supabase.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### UI & UX
- shadcn/ui
- Framer Motion

### Backend
- Supabase (Auth, Database, Edge Functions)

### AI & Modeling
- GPT-5.2 via Lovable AI Gateway
- LSTM neural network forecasting model

---

## How It Works

1. Enter event details (date, type, guest count)
2. The system predicts expected food waste
3. The AI assistant provides insights and recommendations
4. Adjust inventory and preparation
5. Reduce waste and costs over time

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/ecoeats-ai.git
cd ecoeats-ai

```
### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm run dev
```

### Environment variables
Create a .env file:
```bash
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Project Structure
```bash
src/
 ├─ components/
 ├─ pages/
 ├─ hooks/
 ├─ services/
 ├─ lib/
 └─ models/
```

## Why EcoEats?
Food waste affects both profits and the environment.

EcoEats turns daily kitchen decisions into measurable, data-backed actions.
If you can predict waste, you can prevent it.

## Roadmap
- Planned improvements:
- Advanced analytics dashboard
- Automatic inventory tracking
- Multi-branch support
- Mobile responsiveness
- Smart alerts
- POS system integration

## Contributions
- Myself (XxZyX111)
- Lovable.dev
- Muhammad Affan Pasha Kusnanto
- Muhammad Tsaqyf Mumtaz
- Aufa Adlidzil Ikram

Until next time Friends!

