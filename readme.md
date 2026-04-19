# 🛍️ Enterprise E-Commerce Automation Framework

![Node.js](https://img.shields.io/badge/Node.js-18.x%20%7C%2020.x-green?logo=node.js) ![Selenium WebDriver](https://img.shields.io/badge/Selenium-4.35.0-43B02A?logo=selenium) ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

An industrial-grade, deterministic E2E automation suite built with **Node.js** and **Selenium WebDriver**. Architected based on 18 years of QA leadership at top-tier tech firms, this framework guarantees resilient execution, eliminates UI flakiness, and generates CI/CD-ready artifacts.

## ✨ Core Architecture
* **Anti-Flake Design:** Utilizes explicit waits (`WebDriverWait`), JS Executor fallbacks for intercepted clicks, and anti-stale element re-querying loops.
* **Graceful Degradation:** Employs soft assertions. Failures are caught, logged, and screenshotted without halting the entire test suite.
* **Rich Artifacts:** Dynamically generates a beautiful, zero-dependency dark-mode HTML report (`generateHtml.js`) with embedded fullscreen screenshots.

## 🧪 Coverage Matrix (12 Scenarios)
The suite targets 4 key quality quadrants:
1. **UI/UX & Responsive:** Layout integrity across viewport boundaries (Desktop/Mobile).
2. **Core Functional Flows:** E2E Checkout paths, Search algorithms, and Cart state lifecycles.
3. **Data Validation:** Regex-based currency verification and dynamic cart price aggregation.
4. **Stress & Boundary:** Negative inputs, SQLi/XSS-like string injections, and DOM exhaustion (Max Cart Load).

## 🚀 Quick Start

**1. Install Dependencies**
```bash
git clone https://github.com/your-org/ecommerce-automation-framework.git
cd ecommerce-automation-framework
npm install
