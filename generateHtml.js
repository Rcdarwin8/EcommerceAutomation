import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export let htmlReport = `<!DOCTYPE html>
            <html>
            <head>
                <title>Test Report</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #2c2c2c; /* Dark grey background */
                        color: #e0e0e0; /* Light text color for readability */
                    }
                    h1 {
                        text-align: center;
                        color: #66b3ff; /* Lighter blue for heading */
                        margin-bottom: 30px;
                        border-bottom: 2px solid #007bff;
                        padding-bottom: 10px;
                    }
                    table {
                        border-collapse: collapse;
                        width: 90%;
                        margin: 20px auto;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Slightly stronger shadow for dark mode */
                        border-radius: 8px;
                        overflow: hidden;
                        background-color: #3a3a3a; /* Slightly lighter dark for table background */
                    }
                    th, td {
                        border: 1px solid #4a4a4a; /* Darker border color */
                        padding: 12px 15px;
                        text-align: left;
                    }
                    th {
                        background-color: #007bff; /* Vibrant blue header, still stands out */
                        color: white;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    tr:nth-child(even) {
                        background-color: #333333; /* Darker zebra striping */
                    }
                    tr:hover {
                        background-color: #4a4a4a; /* Highlight row on hover */
                    }
                    .pass {
                        color: #28a745; /* Bootstrap-like green (good contrast on dark) */
                        font-weight: bold;
                    }
                    .fail {
                        color: #dc3545; /* Bootstrap-like red (good contrast on dark) */
                        font-weight: bold;
                    }
                    .screenshot {
                        width: 250px;
                        height: auto;
                        border: 1px solid #6c757d; /* Muted border */
                        margin-top: 10px;
                        cursor: pointer;
                        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    }
                    .screenshot:hover {
                        transform: scale(1.02);
                        box-shadow: 0 0 10px rgba(0, 123, 255, 0.7); /* Blue glow on hover */
                    }
                    .fullscreen-overlay {
                        display: none;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.95); /* Even darker overlay */
                        z-index: 1000;
                        justify-content: center;
                        align-items: center;
                    }
                    .fullscreen-image {
                        max-width: 90%;
                        max-height: 90%;
                        border-radius: 5px;
                    }
                    .close-fullscreen {
                        position: absolute;
                        top: 20px;
                        right: 30px;
                        color: #f8f9fa; /* Lighter close button */
                        font-size: 36px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: color 0.2s ease;
                    }
                    .close-fullscreen:hover {
                        color: #66b3ff; /* Lighter blue on hover */
                    }
                </style>
            </head>
            <body>
                <h1>Selenium Test Report</h1>
                <table>
                    <thead>
                        <tr><th>Test Case</th><th>Status</th><th>Error Message</th><th>Screenshot</th></tr>
                    </thead>
                    <tbody>
        `;

export async function generateHTMLReport(testResults) {

        testResults.forEach(result => {
            htmlReport += `
                <tr>
                    <td>${result.testCase}</td>
                    <td class="${result.status.toLowerCase()}">${result.status}</td>
                    <td>${result.errorMessage}</td>
                    <td>
            `;
            if (result.screenshotFilename) {
                htmlReport += `<img src="screenshots/${result.screenshotFilename}" alt="Screenshot of ${result.status.toLowerCase()}" class="screenshot"onclick="openFullscreen('screenshots/${result.screenshotFilename}')">`;
            } else {
                htmlReport += `No screenshot`;
            }
            htmlReport += `
                    </td>
                </tr>
            `;
        });

        htmlReport += `
                    </tbody>
            </table>

            <div id="fullscreenOverlay" class="fullscreen-overlay" onclick="closeFullscreen()">
                <span class="close-fullscreen">&times;</span>
                <img id="fullscreenImage" class="fullscreen-image">
            </div>

            <script>
                function openFullscreen(imageSrc) {
                    const overlay = document.getElementById('fullscreenOverlay');
                    const img = document.getElementById('fullscreenImage');
                    img.src = imageSrc;
                    overlay.style.display = 'flex';
                }

                function closeFullscreen() {
                    const overlay = document.getElementById('fullscreenOverlay');
                    overlay.style.display = 'none';
                }
            </script>
        </body>
        </html>
        `;

        try {
            await fs.writeFile('test_report.html', htmlReport);
            console.log('HTML report generated successfully: test_report.html');
            const reportPath = path.join(__dirname, 'test_report.html'); // Dynamically create the report path

            import('open').then(opener => {
                opener.default(reportPath, { app: { name: 'chrome' } });
                console.log();
            }).catch(err => {
                console.error('Error opening report:', err);
            });
        } catch (error) {
            console.error('Error writing HTML report:', error);
        }
    }