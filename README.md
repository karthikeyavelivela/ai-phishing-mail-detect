

# 🛡️ Phishing Email Detector

An advanced **AI-powered phishing email detection system** designed to analyze emails in real time, educate users, and visually demonstrate threat intelligence through interactive UI, gamification, and detailed analytics.

---
<img src="https://cdn.dribbble.com/userupload/21182317/file/original-2a194b3faa33ce9a46e4cde63b928528.gif">
## 🚀 Overview

Phishing Email Detector helps users identify **malicious, suspicious, and safe emails** using multiple detection techniques, real-time feedback, and confidence scoring.  
It combines **security intelligence + modern UX + learning-driven gamification**.

---

## 🎯 Core Features

### 🔍 Detection Engine
- Advanced keyword detection (urgent, prize, threats, action prompts)
- IP-based URL detection
- Shortened URL detection (bit.ly, tinyurl, etc.)
- Suspicious domain detection (`.tk`, `.ml`, `.ga`, etc.)
- Brand impersonation detection (PayPal, Amazon, Microsoft, etc.)
- Sensitive information request detection
- Attachment & download mention detection
- Generic greeting detection
- Link count analysis
- Confidence scoring (85–99%)

---

## ⚡ Real-time Analysis
- Live threat scoring while typing (500ms debounce)
- Real-time score badge on shield icon
- Instant feedback without clicking “Analyze”

---

## 🎨 Micro-interactions & Animations

### Visual Feedback
- AI “thinking” typing indicator
- Confetti effect for safe emails (score < 30)
- Shake animation for high-risk emails (score ≥ 70)
- 4-step animated analysis progress indicator
- Smooth transitions & icon animations
- Button and card scale effects

---

## 🧠 Interactive Features

### Analysis Tools
- Clickable URL highlighter
- Copy analysis report to clipboard
- Shareable result links
- Export analysis as PDF
- History sidebar (last 20 analyses)
- Dark/Light mode with smooth transitions

### User Interface
- Example email library (7 preloaded samples)
- Categorized examples (Safe / Suspicious / Phishing)
- One-click email loading
- Expandable sections
- Toast notifications for all actions
- Tooltips on interactive elements

---

## 🎮 Gamification & Learning

### Quiz & Achievements
- Quiz mode with 5 security questions
- Real-time feedback on answers
- Score tracking per quiz
- Achievement system:
  - First Scan
  - Phishing Hunter
  - Security Expert
  - Perfect Detection
  - Safe Keeper
  - Streak Master
- Achievement unlock notifications
- Progress stored in LocalStorage

---

## 📊 Statistics Dashboard
- Total email analyses
- Phishing detected count
- Safe email count
- Detection accuracy percentage
- Achievements earned
- Animated stat cards & progress bars

---

## 📈 Results Visualization

### Analysis Output
- Threat score (0–100) with color coding
- Status: Safe / Suspicious / Phishing
- Confidence percentage
- Detection metrics grid:
  - Keyword matches
  - URL issues
  - Sensitive data requests
  - Brand impersonation checks
- Pie chart for threat breakdown
- Animated detailed reason list
- Contextual security recommendations

### Export Options
- Copy formatted report
- Share via URL
- Export full report as PDF

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|--------|-------|
| `Ctrl + Enter` | Analyze email |
| `Esc` | Reset analysis |
| `H` | Toggle history |
| `Q` | Open quiz mode |
| `S` | Toggle stats dashboard |
| `?` | Show shortcuts panel |

---

## ♿ Accessibility

### Screen Reader Support
- ARIA labels and live regions
- Skip-to-content support
- Semantic HTML structure
- Full keyboard navigation

### Visual Accessibility
- High contrast mode
- Focus-visible indicators
- Reduced motion support
- Color-blind friendly palette
- WCAG-compliant contrast ratios

---

## 🖨️ Print Support
- Optimized print layout
- Print-specific CSS rules
- Hidden non-essential UI elements
- Page break controls

---

## 📚 Educational Content

### Security Tips
- Rotating tips carousel (10 tips)
- Auto-rotate every 5 seconds
- Pause on hover
- Manual navigation with indicators

### Threat-based Recommendations
- **Safe (<30):** General awareness tips
- **Suspicious (30–69):** Caution & verification steps
- **Phishing (≥70):** Immediate action guidance

---

## 💾 Data Persistence
- Analysis history (last 20)
- User statistics & progress
- Achievement tracking
- Theme preference
- Sound & UI settings  
*(Stored securely in LocalStorage)*

---

## 🎨 Design System

- Gradient backgrounds
- Glass-morphism UI
- Animated mesh gradients
- Consistent HSL color tokens
- Smooth transitions & shadows
- Fully responsive (mobile / tablet / desktop)

### Color Coding
- 🟢 Green — Safe
- 🟡 Yellow — Suspicious
- 🔴 Red — Phishing
- 🔵 Blue — Primary actions
- 🟣 Purple — Accent

---

## ⚙️ Performance Optimizations
- Debounced real-time analysis
- Lazy-loaded components
- Efficient React re-renders
- 60 FPS animations
- Instant data access via LocalStorage

---

## 📱 Responsive Design
- Mobile-first layout
- Touch-friendly interactions
- Adaptive typography
- Collapsible panels for small screens
- Gesture-friendly UI

---

## 🧪 Ideal Use Cases
- Cybersecurity education
- Phishing awareness training
- College projects & demos
- Security portfolio projects
- Open-source learning tools

---

## 📄 License
This project is open-source and intended for **educational and research purposes**.

---

## ⭐ If you find this useful
Give the repo a ⭐ and help spread phishing awareness!
