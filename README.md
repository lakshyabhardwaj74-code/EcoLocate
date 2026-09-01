# EcoLocate
# ♻️ EcoLocate — AI-Powered E-Waste Facility Locator & Management Platform

[![SIH 2024/2026](https://img.shields.io/badge/SIH-Problem%20Statement%201392-brightgreen?style=for-the-badge&logo=target)](https://www.sih.gov.in/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20%7C%20Postgres%20Ready-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **A comprehensive full-stack ecosystem tackling e-waste mismanagement by connecting citizens, certified recycling facilities, and regulatory authorities with intelligent AI identification, real-time GIS mapping, doorstep pickups, and gamified eco-rewards.**

---

## 📌 Table of Contents

- [Problem Statement & Vision](#-problem-statement--vision)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [User Roles & Workflows](#-user-roles--workflows)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#1-prerequisites)
  - [Installation](#2-installation)
  - [Database Setup & Seeding](#3-database-setup--seeding)
  - [Running the App](#4-running-the-app)
- [Demo Credentials](#-demo-credentials)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Project Directory Structure](#-project-directory-structure)
- [UN Sustainable Development Goals (SDGs)](#-un-sustainable-development-goals-sdgs)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Problem Statement & Vision

**Smart India Hackathon (SIH) — Problem ID: 1392**

Rapid digital transformation has made electronic waste (e-waste) the fastest-growing solid waste stream in the world. India is the third-largest generator of e-waste, yet over **90%** of it is handled by the informal sector without safety standards, causing severe toxic lead, mercury, and cadmium contamination while losing billions of dollars in precious metals (Gold, Silver, Copper).

### 💡 Our Solution
**EcoLocate** bridges the gap between citizens, dismantlers, and government bodies (CPCB/SPCB) through:
1. **Zero-friction discovery** of certified dismantlers and drop-off kiosks.
2. **AI-driven instant assessment** of device recyclability, hazardous warnings, and precious metal recovery potential.
3. **End-to-end transparent doorstep collection** with digital chain-of-custody tracking.
4. **Gamified civic incentives** that reward responsible e-waste disposal with redeemable vouchers and tree planting drives.

---

## ✨ Key Features

### 1. 🗺️ Interactive GIS Facility Locator
- **Geolocated Map Integration:** Powered by Leaflet & OpenStreetMap, displaying nationwide certified recycling hubs, authorized collection centers, and neighborhood drop-off kiosks.
- **Smart Filtering:** Filter by accepted device categories (*Smartphones, Laptops, Batteries, CRT Monitors, Heavy Home Appliances*), verified CPCB status, and operational hours.
- **Distance & Route Calculator:** Automatically sorts facilities by proximity to the user with one-click directions.

### 2. 🤖 AI Visual E-Waste Scanner & Classifier
- **Image Recognition:** Upload or capture an image of any electronic item to classify category, model, and weight.
- **Precious Material Breakdown:** Estimated yields of Gold ($Au$), Silver ($Ag$), Copper ($Cu$), Aluminum ($Al$), and plastics.
- **Toxicity & Safety Alerts:** Critical warnings for swollen Lithium-ion batteries, mercury backlights, and CRT glass handling.
- **Instant Reward Valuation:** Dynamic reward credit estimation based on device condition and recyclable materials.
- **Hybrid Architecture:** Supports Google Gemini / Vision AI with seamless offline simulation fallback for zero-downtime demos.

### 3. 🚚 Doorstep Pickup Booking & Real-time Tracking
- **Multi-Step Scheduling:** Book certified home pickups with preferred date, time slot, device specs, and pickup address.
- **Digital Chain-of-Custody:** Every request generates a unique tracking code (e.g., `EC-849201`).
- **Live Status Lifecycle:** `REQUESTED` ➔ `CONFIRMED` ➔ `ASSIGNED` ➔ `PICKED_UP` ➔ `RECYCLED` ➔ `COMPLETED`.

### 4. 🎁 Gamified Eco-Credits & Reward Catalog
- **Earn Credits:** Verified pickups deposit Eco-Credits directly into the citizen's wallet upon physical verification by the facility.
- **Redemption Marketplace:**
  - 🛍️ E-Commerce & shopping passes (Amazon, Flipkart).
  - 🌳 Real-world environmental impact: Sponsor native tree saplings with verified plantation certificates.
  - 🎋 Sustainable eco-lifestyle products (Recycled bamboo tech accessories).
- **Transaction Ledger:** Immutable history of credits earned and vouchers redeemed.

### 5. 👥 Multi-Role Enterprise Dashboards

| Role | Capabilities |
| :--- | :--- |
| **👤 Citizen User** | Search facilities, run AI scans, schedule doorstep pickups, track orders, manage Eco-Credits wallet, write facility reviews. |
| **🏭 Facility Manager** | Manage incoming pickup requests, inspect item manifests, update request status, edit facility hours, recycling capacities, and operational services. |
| **🛡️ CPCB / System Admin** | Platform-wide analytics, monitor tons of e-waste diverted from landfills, verify/reject/suspend facility partners, audit user activity. |

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Citizen User / Browser] -->|React 19 + Tailwind CSS| B[Client Web App]
    B -->|REST API Requests + JWT| C[Express.js Server]
    
    subgraph "Backend Services"
        C --> D[Auth & RBAC Middleware]
        C --> E[Pickup Management Service]
        C --> F[Facility Directory Service]
        C --> G[AI Classifier & Material Engine]
        C --> H[Rewards & Transaction Ledger]
    end
    
    subgraph "Data Layer"
        D & E & F & G & H --> I[Prisma ORM]
        I --> J[(SQLite / PostgreSQL Database)]
    end
    
    subgraph "External Integrations"
        G -.->|Vision API / Gemini| K[AI Vision Model]
        B -.->|Leaflet / OpenStreetMap| L[Map Tile Providers]
    end

