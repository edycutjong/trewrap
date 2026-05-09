<div align="center">
  <h1>Trewrap 🚀</h1>
  <p><em>Spotify Wrapped for crypto wallets. 5 Dune SQL signals → AI persona → shareable card.</em></p>
  <img src="docs/readme-hero.png" alt="Trewrap Hero" width="100%">
  
  <br/>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://trewrap.edycu.dev)
  [![Pitch Video](https://img.shields.io/badge/Pitch-Video-red.svg)](https://youtube.com/your-video)
  [![Pitch Deck](https://img.shields.io/badge/Pitch-Deck-f59e0b.svg)](https://trewrap.edycu.dev/pitch)
  [![Superteam Frontier](https://img.shields.io/badge/Superteam-Frontier_Hackathon-1E40AF?style=flat&logo=solana&logoColor=white)](https://superteam.fun/earn/listing/dune)

  <br/>

  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
  ![Dune Analytics](https://img.shields.io/badge/Dune_Analytics-000000?style=flat&logo=dune&logoColor=white)
  ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
  ![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=flat&logo=vitest&logoColor=white)
</div>

---

## 📸 See it in Action
*(Demo GIF and UI screenshots can be found in the `public` directory)*

<div align="center">
  <img src="public/og-image.png" alt="App Demo" width="100%">
</div>

## 💡 The Problem & Solution
While on-chain data is public, it's often too technical and dry for average users to engage with. 
**Trewrap** solves this by providing a Spotify Wrapped experience for crypto wallets. It queries 5 specific Dune SQL signals to evaluate a user's on-chain behavior, generates a roasted AI persona, and delivers a shareable card.

**Key Features:**
- ⚡ **High Performance:** Seamless integration with Dune API and optimized workflows.
- 🔒 **Secure by Design:** Verifiable on-chain actions and robust data protection.
- 🎨 **Intuitive UX:** Beautiful, user-centric interface built for scale.

## 🏗️ Architecture & Tech Stack

### Tech Stack
| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | Next.js 16, React 19 | App Router, SSR, Server Components |
| **Styling** | Tailwind CSS v4 | High-performance responsive UI |
| **Language** | TypeScript | Strict type safety across the stack |
| **Data Source** | Dune Analytics | High-quality SQL-driven on-chain data |
| **AI Engine** | OpenAI | Generates custom personas and roasts based on Dune signals |
| **Testing** | Vitest | Comprehensive unit and component testing |

For a detailed breakdown of our system architecture and data flow, please refer to the [Architecture Document](docs/ARCHITECTURE.md).

## 🏆 Sponsor Tracks Targeted
* **Dune Analytics Integration**: We integrated the Dune API to fetch highly specific on-chain behavioral signals. The implementation handles polling and pagination perfectly.
* **Frontend Infrastructure**: We deployed our high-performance edge application using Vercel. 

## 🚀 Run it Locally (For Judges)

1. **Clone the repo:** `git clone https://github.com/edycutjong/trewrap.git`
2. **Install dependencies:** `npm install`
3. **Set up environment variables:** Rename `.env.example` to `.env.local` and add your keys (Dune API Key and OpenAI API Key).
4. **Run the app:** `npm run dev`

> **Note for Judges:** 
> You can skip importing a real wallet or setting up API keys! We have built-in fallback mock data that simulates the entire Dune API and AI persona generation process so you can test the flow instantly.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
