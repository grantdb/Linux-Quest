# Linux Quest

![Reddit](https://img.shields.io/badge/Reddit-FF4500?style=for-the-badge&logo=reddit&logoColor=white)
![Devvit](https://img.shields.io/badge/Devvit-FF4500?style=for-the-badge&logo=devvit&logoColor=white)
![Linux](https://img.shields.io/badge/Focus-Linux_Mastery-E33332?style=for-the-badge&logo=linux&logoColor=white)
![Education](https://img.shields.io/badge/Category-Educational_RPG-blue?style=for-the-badge)
![Simulation](https://img.shields.io/badge/UX-Hardware_Simulation-brightgreen?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Validated-success?style=for-the-badge)

Linux Quest is an immersive educational RPG that guides community members through the intricacies of mastering Linux distributions and kernels. By combining simulation-style hardware interactions with a quest-based progression system, it turns technical learning into a high-engagement community event.

## Features

- **Mastery-Driven RPG Mechanics**: A sophisticated quest system that teaches real-world Linux concepts through interactive gameplay.
- **Hardware & Kernel Simulation**: Allows users to experience "virtual installations" and system configurations directly within Reddit.
- **Dynamic Progression Tracking**: Features specialized leaderboards that categorize players by their level of technical mastery.
- **High-Fidelity Interaction**: Custom-engineered frontend ensures responsive, gaming-grade performance in the native browser environment.

## Technical Hardening (v0.0.17)

This version introduces significant stability and architecture improvements:
- **Direct Webview Rendering**: Reconciled post architecture for zero-latency loading.
- **State Machine Resilience**: Implemented `useCallback` stability and `useRef` event guarding.
- **Fail-Safe Logic**: Added emergency rescue paths for architecture mismatches (e.g., Raspi/Workstation).

## Configuration

| Component | Description |
|-----------|-------------|
| **Architecture** | Direct React Webview post with a thin server-side message bridge. |
| **Persistence** | Global leaderboards managed via Devvit Redis. |

## Legal

This application is subject to the following legal agreements:
- [Terms of Service](https://github.com/grantdb/reddit-app-legal/blob/main/linux-quest/TERMS.md)
- [Privacy Policy](https://github.com/grantdb/reddit-app-legal/blob/main/linux-quest/PRIVACY.md)

---
*Built for the Reddit community.*

