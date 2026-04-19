# 🛒 E-Commerce Selenium Test Suite

An automated end-to-end test suite built with **Selenium WebDriver** and **Node.js** for the [TesterBud Dummy E-Commerce](https://testerbud.com/practice-ecommerece-website/) practice website. The suite covers functional, boundary, and regression scenarios and generates a self-contained HTML report with screenshots on every run.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Tests](#running-the-tests)
- [Test Cases](#test-cases)
- [HTML Report](#html-report)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## ✨ Features

- **12 automated test cases** covering core e-commerce flows
- Automatic **screenshot capture** on pass and fail
- Self-contained **dark-themed HTML report** auto-opened in Chrome after each run
- Fullscreen screenshot viewer built into the report
- Graceful error handling — a single test failure never blocks the rest of the suite
  
---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18 (ESM) | Runtime |
| Selenium WebDriver | ^4.35.0 | Browser automation |
| ChromeDriver | ^139.0.2 | Chrome bridge |
| open | ^10.2.0 | Auto-open report in browser |

---

## ✅ Prerequisites

- **Node.js** v18 or higher
- **Google Chrome** installed
- **ChromeDriver** matching your Chrome version — download from [chromedriver.chromium.org](https://chromedriver.chromium.org/downloads)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install
```

---

## ⚙️ Configuration

Before running the tests, update the `chromedriverPath` variable at the top of `final.js` to point to your local ChromeDriver executable:

```js
// final.js  (line ~20)
const chromedriverPath = 'C:\\Users\\YourUser\\path\\to\\chromedriver.exe';
// macOS / Linux example:
// const chromedriverPath = '/usr/local/bin/chromedriver';
```

> **Tip:** Make sure the ChromeDriver version matches your installed Chrome version exactly. Check your Chrome version at `chrome://settings/help`.

---

## ▶️ Running the Tests

```bash
node final.js
```

The runner will:
1. Launch a Chrome window
2. Execute all 12 test cases sequentially
3. Save screenshots to `./screenshots/`
4. Write `test_report.html` and open it automatically in Chrome

---

## 🧪 Test Cases

| # | Test Case | Type |
|---|---|---|
| TC_01 | Homepage Load & Responsiveness | Functional |
| TC_02 | Search Function Boundary Testing | Boundary |
| TC_03 | Full Cart Cycle (Add All → Remove All → Sequential) | Functional |
| TC_04 | Navigation Links Validation | Functional |
| TC_05 | Add to Cart Functionality | Functional |
| TC_06 | Quantity Modification | Functional |
| TC_07 | Multiple Products Cart Management | Functional |
| TC_08 | Price Validation & Calculation | Functional |
| TC_09 | End-to-End Shopping Flow | Integration |
| TC_10 | Negative Quantity Boundary Test | Boundary |
| TC_11 | Empty / Special Character Search Boundary Test | Boundary |
| TC_12 | Maximum Cart Load Boundary Test | Boundary / Stress |

---

## 📊 HTML Report

After the run, `test_report.html` is generated in the project root and opened automatically in Chrome. The report includes:

- **PASS / FAIL** status with colour-coded rows
- **Error message** for every test
- **Embedded screenshots** with a click-to-fullscreen viewer
- Dark theme for comfortable reading

---

## 📸 Screenshots

Screenshots are stored in `./screenshots/` and follow the naming convention:

```
<TestCaseName>_<PASS|FAIL>_<timestamp>.png
```

Example: `TC_01_VerifyHomepageLoadAndResponsiveness_PASS_1718000000000.png`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-test-case`
3. Commit your changes: `git commit -m 'Add TC_13: Checkout form validation'`
4. Push to the branch: `git push origin feature/new-test-case`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
