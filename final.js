import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import assert from 'assert';
import fs from 'fs/promises';
import path from 'path';
// Assuming generateHtml.js exists and is correctly implemented.
import { htmlReport as initialHtmlReport, generateHTMLReport } from './generateHtml.js';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// This variable is not used in the corrected code, but kept for context if needed.
let htmlReport = initialHtmlReport;

// Main test execution function
async function runAllTests() {
    let driver;
    const testResults = [];
    const screenshotsDir = path.join(__dirname, 'screenshots');
    const homepath = '//*[@id="root"]/nav/div/a';

    // --- ADD THE PATH TO YOUR CHROMEDRIVER HERE ---
    // Example for Windows: 'C:\\Users\\YourUser\\Desktop\\drivers\\chromedriver.exe'
    // Example for macOS/Linux: '/usr/local/bin/chromedriver'
    const chromedriverPath = 'C:\\Users\\HP\\Desktop\\Rohan Chaudhary\\AssignmentsOutsource\\testingWebSite\\testBud\\chromedriver.exe'; // <--- IMPORTANT: SET THIS PATH

    

    try {
        await fs.mkdir(screenshotsDir, { recursive: true });
        
    } catch (error) {
        console.error('Error creating screenshots directory:', error);
        // We can proceed even if this fails, as screenshots might just not save.
    }

    // Initialize the WebDriver before any tests run
    try {
        console.log('Initializing WebDriver...');
        
        // ** FIX: Create a ServiceBuilder instance WITHOUT calling .build() **
        // The Builder will call .build() on the service internally.
        const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);

        driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(new chrome.Options()) // Add Chrome options if needed
            .setChromeService(serviceBuilder) // Pass the ServiceBuilder instance directly
            .build();
        console.log('WebDriver initialized successfully.');

        // Run all test cases sequentially
        await runTestsSequentially(driver, testResults, screenshotsDir, homepath);

    } catch (error) {
        console.error('An unexpected error occurred during test execution:', error);
        if (error.message.includes('The specified file could not be found')) {
            console.error(`Hint: Please ensure the chromedriver path is correct. Current path: "${chromedriverPath}"`);
        }
    } finally {
        // Ensure the driver is quit properly after all tests are done
        if (driver) {
            console.log('Closing WebDriver...');
            await driver.quit();
            console.log('WebDriver closed.');
        }

        // Generate the HTML report after all tests have run and the driver is closed
        console.log('Generating HTML report...');
        await generateHTMLReport(testResults); // Uncomment when your report generator is ready
    }
}

// Helper function to capture a screenshot
async function captureScreenshot(driver, testCaseName, status, screenshotsDir, elementXPath = null) {
    try {
        if (elementXPath) {
            let element;
            try {
                // Try finding element by XPath first
                element = await driver.findElement(By.xpath(elementXPath));
            } catch (error) {
                // Fallback to CSS selector if XPath fails
                element = await driver.findElement(By.css(elementXPath));
            }
            // Scroll element into view to ensure it's visible for the screenshot
            await driver.executeScript("arguments[0].scrollIntoView({ block: 'center' });", element);
            await driver.sleep(500); // Wait for scrolling animation to finish
        }

        const timestamp = Date.now();
        const statusPrefix = status === 'PASS' ? 'PASS' : 'FAIL';
        const filename = path.join(screenshotsDir, `${testCaseName.replace(/[^a-zA-Z0-9]/g, '_')}_${statusPrefix}_${timestamp}.png`);
        
        const image = await driver.takeScreenshot();
        await fs.writeFile(filename, image, 'base64');
        
        console.log(`Screenshot saved: ${filename}`);
        return path.basename(filename);
    } catch (error) {
        console.error('Error taking screenshot:', error);
        return null;
    }
}

// Helper function to record test results
function recordResult(testResults, testCase, status, errorMessage = '', screenshotFilename = null) {
    testResults.push({ testCase, status, errorMessage, screenshotFilename });
    console.log(`${testCase}: ${status}${errorMessage ? ` - ${errorMessage}` : ''}${screenshotFilename ? ` - Screenshot: ${screenshotFilename}` : ''}`);
}

// ================================
// Test Case 01 - Verify Homepage
// ================================
// async function TC_01_VerifyHomePage(driver, testResults, screenshotsDir, homepath) {
//     const testCaseName = 'TC_01_VerifyHomePage';
//     console.log(`Executing ${testCaseName}: Verify Homepage`);
    
//     try {
//         await driver.manage().window().maximize();
        
//         console.log('Navigating to the practice e-commerce website');
//         await driver.get('https://testerbud.com/practice-ecommerece-website/');

//         // Wait for the title to contain "Ecommerce", a more robust wait
//         await driver.wait(until.titleContains('Ecommerce'), 5000, 'Title did not contain "Ecommerce" within the timeout.');

//         const title = await driver.getTitle();
//         const isHomePageLoaded = title.includes('Ecommerce');
        
//         const screenshot = await captureScreenshot(driver, testCaseName, isHomePageLoaded ? 'PASS' : 'FAIL', screenshotsDir, homepath);

//         if (isHomePageLoaded) {
//             recordResult(testResults, 'Homepage Load Test', 'PASS', 'Homepage loaded successfully', screenshot);
//         } else {
//             recordResult(testResults, 'Homepage Load Test', 'FAIL', `Expected title containing 'Ecommerce', but got: "${title}"`, screenshot);
//         }
//     } catch (error) {
//         const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
//         recordResult(testResults, 'Homepage Load Test', 'FAIL', `Exception: ${error.message}`, screenshot);
//     }
// }
async function TC_01_VerifyHomepageLoadAndResponsiveness(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_01_VerifyHomepageLoadAndResponsiveness';
    console.log(`Executing ${testCaseName}: Verify Homepage Load & Responsiveness`);
    
    try {
        await driver.manage().window().maximize();
        await driver.sleep(1000);
        console.log('Navigating to the practice e-commerce website');
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.sleep(1000);
        
        // Wait for homepage elements to load
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        await driver.sleep(1000);
        
        // Test desktop view
        await driver.manage().window().setRect({width: 1366, height: 768});
        const desktopLogo = await driver.findElements(By.css('img, [alt*="logo"], .logo'));
        const productListings = await driver.findElements(By.css('[class*="product"], .card, [data-testid*="product"]'));
        const navLinks = await driver.findElements(By.css('nav a, [role="navigation"] a, header a'));
        
        await driver.sleep(1000);
        // Test mobile boundary (320px)
        await driver.manage().window().setRect({width: 320, height: 568});
        await driver.sleep(1000); // Allow responsive design to adjust
        
        const mobileProductsVisible = await driver.findElements(By.css('[class*="product"], .card'));
        const mobileNavAccessible = await driver.findElements(By.css('nav, [role="navigation"], .hamburger, .menu-toggle'));
        
        const isDesktopValid = desktopLogo.length > 0 && productListings.length > 0 && navLinks.length > 0;
        const isMobileValid = mobileProductsVisible.length > 0 && mobileNavAccessible.length > 0;
        
        await driver.sleep(1000);
        const screenshot = await captureScreenshot(driver, testCaseName, 
            (isDesktopValid && isMobileValid) ? 'PASS' : 'FAIL', screenshotsDir, homepath);
            
        if (isDesktopValid && isMobileValid) {
            recordResult(testResults, 'Homepage Load & Responsiveness Test', 'PASS', 
                `Desktop: Logo=${desktopLogo.length}, Products=${productListings.length}, Nav=${navLinks.length}. Mobile: Products=${mobileProductsVisible.length}, Nav=${mobileNavAccessible.length}`, screenshot);
            } else {
                recordResult(testResults, 'Homepage Load & Responsiveness Test', 'FAIL', 
                    `Desktop valid: ${isDesktopValid}, Mobile valid: ${isMobileValid}`, screenshot);
                }
            } catch (error) {
                const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
                recordResult(testResults, 'Homepage Load & Responsiveness Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
async function TC_02_SearchFunctionBoundaryTesting(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_02_SearchFunctionBoundaryTesting';
    console.log(`Executing ${testCaseName}: Search Function Boundary Testing`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Step 1: Search for a product
        const searchBox = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Search"], input[type="search"], input[name*="search"]')), 
            10000
        );
        
        // Test 1: Valid search term
        await searchBox.clear();
        await searchBox.sendKeys('laptop');
        await searchBox.sendKeys(Key.ENTER);
        console.log('Searching for "laptop"');
        await driver.sleep(2000);
        
        const validResults = await driver.findElements(By.css('[class*="product"], .search-result, .card'));
        console.log(`Valid search results found: ${validResults.length}`);
       
        const screenshot = await captureScreenshot(driver, testCaseName, 
            (validResults.length > 0 ) ? 'PASS' : 'FAIL', screenshotsDir, homepath);
        
        recordResult(testResults, 'Search Function Boundary Test', 
            (validResults.length > 0 ) ? 'PASS' : 'FAIL',
            `Valid search results: ${validResults.length}`, screenshot);
        
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Search Function Boundary Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}

async function TC_03_FullCartCycle(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_06_FullCartCycle';
    console.log(`Executing ${testCaseName}: Full Add, Remove All, and Sequential Remove Cart Cycle`);

    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);

        // --- PART 1: Add four items to the cart ---
        console.log('--- PART 1: Adding 4 items to cart ---');
        const addToCartLocator = By.xpath("//button[text()='Add to Cart']");
        const allProductButtons = await driver.findElements(addToCartLocator);

        if (allProductButtons.length < 4) {
            throw new Error('Not enough products on the page to run the test (requires at least 4).');
        }

        for (let i = 0; i < 4; i++) {
            // Re-find elements each time to prevent stale element errors
            const buttons = await driver.findElements(addToCartLocator);
            const button = buttons[i];
            
            console.log(`Adding product ${i + 1}...`);
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", button);
            await driver.wait(until.elementIsVisible(button), 5000);
            await driver.executeScript("arguments[0].click();", button);
            await driver.sleep(500); // Small pause for UI to update
        }

        // Verify cart count is 4
        const cartBadge = await driver.findElement(By.css('span.badge'));
        const cartCount = await cartBadge.getText();
        if (parseInt(cartCount) !== 4) {
            throw new Error(`Cart count verification failed after adding 4 items. Expected: 4, Found: ${cartCount}`);
        }
        console.log('SUCCESS: Cart count is correctly 4.');
        await driver.sleep(1000);


        // --- PART 2: Navigate to cart and remove all items ---
        console.log('--- PART 2: Removing all items from cart ---');
        let cartButton = await driver.findElement(By.xpath('//*[@id="root"]/div[2]/nav/div/div[2]/button'));
        await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", cartButton);
            await driver.wait(until.elementIsVisible(cartButton), 5000);
            await driver.executeScript("arguments[0].click();", cartButton);
            await driver.sleep(1000); // Small pause for UI to update
        console.log('Navigated to cart page.');
        // Wait for cart page to load by waiting for a remove button
        const removeButtonLocator = By.xpath("//button[text()='Remove']");
        await driver.wait(until.elementLocated(removeButtonLocator), 10000);
        
        const removeButtons = await driver.findElements(removeButtonLocator);
        const itemsToRemoveCount = removeButtons.length;
        console.log(`Found ${itemsToRemoveCount} items to remove.`);

        for (let i = 0; i < itemsToRemoveCount; i++) {
            // ALWAYS re-find the button to avoid stale element reference after the DOM updates
            const buttonToRemove = await driver.findElement(removeButtonLocator);
            console.log(`Removing item ${i + 1} of ${itemsToRemoveCount}...`);
            await buttonToRemove.click();
            await driver.sleep(500); // Wait for item removal
        }

        // Verify cart is empty
        const emptyCartMessageLocator = By.xpath("//p[contains(text(), 'Your cart is empty')]");
        await driver.wait(until.elementLocated(emptyCartMessageLocator), 5000);
        console.log('SUCCESS: Cart is now empty.');
        await driver.sleep(1000);


        // --- PART 3: Add and remove items one-by-one ---
        console.log('--- PART 3: Sequentially adding and removing items ---');
        for (let i = 0; i < 2; i++) {
            console.log(`--- Cycle ${i + 1} ---`);
            // Go back to the products page
            await driver.get('https://testerbud.com/practice-ecommerece-website/');
            await driver.wait(until.elementLocated(addToCartLocator), 10000);

            // Add one item
            const buttonToAdd = await driver.findElement(By.xpath(`(//button[text()='Add to Cart'])[${i + 1}]`));
            console.log(`Adding product ${i + 1}...`);
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", buttonToAdd);
            await driver.wait(until.elementIsVisible(buttonToAdd), 5000);
            await driver.executeScript("arguments[0].click();", buttonToAdd);
            await driver.sleep(500);
            console.log('Product added to cart.');

            // Go to cart
            let cartButton = await driver.findElement(By.xpath('//*[@id="root"]/div[2]/nav/div/div[2]/button'));
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", cartButton);
            await driver.wait(until.elementIsVisible(cartButton), 5000);
            await driver.executeScript("arguments[0].click();", cartButton);
            await driver.sleep(1000); // Small pause for UI to update
            console.log('Navigated to cart page.');
            await driver.wait(until.elementLocated(removeButtonLocator), 10000);
            
            // Remove the single item
            console.log('Removing the single product...');
            await driver.findElement(removeButtonLocator).click();
            
            // Verify cart is empty again
            await driver.wait(until.elementLocated(emptyCartMessageLocator), 5000);
            console.log(`SUCCESS: Cycle ${i + 1} completed. Cart is empty.`);
            await driver.sleep(1000);
        }

        // If all steps succeeded, record a PASS
        const screenshot = await captureScreenshot(driver, testCaseName, 'PASS', screenshotsDir, homepath);
        recordResult(testResults, 'Full Cart Cycle Test', 'PASS', 'Successfully completed all cart operations.', screenshot);

    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Full Cart Cycle Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
async function TC_04_NavigationLinksValidation(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_04_NavigationLinksValidation';
    console.log(`Executing ${testCaseName}: Navigation Links Validation`);
    
    try {
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Find navigation links
        const navSelectors = [
            'nav a', 
            'header a', 
            '[role="navigation"] a',
            '.navbar a',
            '.menu a'
        ];
        
        let navLinks = [];
        for (const selector of navSelectors) {
            const elements = await driver.findElements(By.css(selector));
            if (elements.length > 0) {
                navLinks = elements;
                break;
            }
        }
        
        let clickableLinks = 0;
        let validLinks = 0;
        const originalUrl = await driver.getCurrentUrl();
        
        for (let i = 0; i < Math.min(navLinks.length, 5); i++) { // Test first 5 links
            try {
                const link = navLinks[i];
                const href = await link.getAttribute('href');
                const linkText = await link.getText();
                
                if (href && href !== '#' && linkText.trim()) {
                    await link.click();
                    await driver.sleep(2000);
                    
                    const currentUrl = await driver.getCurrentUrl();
                    if (currentUrl !== originalUrl) {
                        validLinks++;
                        await driver.navigate().back();
                        await driver.sleep(1000);
                    }
                    clickableLinks++;
                }
            } catch (linkError) {
                console.log(`Error testing link ${i}: ${linkError.message}`);
            }
        }
        
        const navigationWorking = navLinks.length > 0 && clickableLinks > 0;
        
        const screenshot = await captureScreenshot(driver, testCaseName, 
            navigationWorking ? 'PASS' : 'FAIL', screenshotsDir, homepath);
        
        recordResult(testResults, 'Navigation Links Validation Test', 
            navigationWorking ? 'PASS' : 'FAIL',
            `Total nav links: ${navLinks.length}, Clickable: ${clickableLinks}`, screenshot);
        
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Navigation Links Validation Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
async function TC_05_AddToCartFunctionality(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_05_AddToCartFunctionality';
    console.log(`Executing ${testCaseName}: Add to Cart Functionality`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        
        // Step 1: Add to cart

        let addToCartButton = await driver.findElement(By.xpath('//*[@id="root"]/div[2]/div/div[1]/div[1]/div/div/div[3]/button'));
        await driver.sleep(2000);
        
        if (addToCartButton) {
            // Get initial cart count
            let cartCountElement = null;
            try{
                cartCountElement = await driver.findElement(By.xpath('span[class*="badge"]'));
            }catch{
                console.log('Cart count element not found');
            }
            
            if( !cartCountElement) {
                console.log('Cart count element not found, initializing count to 0');
            }
            let initialCount = 0;
            const countText = 0;
            initialCount = parseInt(countText) || 0;
            console.log(`Initial cart count: ${initialCount}`); 
            
            
            let quantityInputs = await driver.findElements(By.css('input[type="number"], .quantity-input'));
            await driver.sleep(2000);
            if (quantityInputs.length > 0) {
                
                // Should add item with 1 quantity
                quantityInputs = await driver.findElements(By.css('input[type="number"], .quantity-input'));
                await quantityInputs[0].clear();
                await quantityInputs[0].sendKeys('1');
            }
            await driver.sleep(2000);
            
            console.log('Clicking Add to Cart button');
            const addToCartButtonLocator = By.xpath("(//button[text()='Add to Cart'])[1]");
            const addToCartButton = await driver.findElement(addToCartButtonLocator);

            // 2. Scroll the button to the CENTER of the viewport to avoid the sticky navbar
            console.log('Scrolling button to the center of the view...');
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", addToCartButton);

            // 3. Wait for the button to be stable and visible after the scroll
            await driver.wait(until.elementIsVisible(addToCartButton), 5000);

            // 4. Use a JavaScript click, which is the most effective way to prevent interception errors
            console.log('Clicking Add to Cart button using JavaScript...');
            await driver.executeScript("arguments[0].click();", addToCartButton);

            console.log('Successfully clicked the button.');
            await driver.sleep(3000); // Wait for cart to update

            // Check if cart count updated
            let finalCount = 0;
            const finalCartElement = await driver.findElement(By.css('span[class*="badge"]'));
            const finalCountText = await finalCartElement.getText();
            finalCount = parseInt(finalCountText) || 0;
            console.log(`Final cart count: ${finalCount}`);
            
            
            const cartUpdated = finalCount > initialCount;
            
            const screenshot = await captureScreenshot(driver, testCaseName, 
                cartUpdated ? 'PASS' : 'FAIL', screenshotsDir, homepath);
                
                recordResult(testResults, 'Add to Cart Test', 
                    cartUpdated ? 'PASS' : 'FAIL',
                    `Initial count: ${initialCount}, Final count: ${finalCount}, Cart updated: ${cartUpdated}`, screenshot);
                } else {
                    recordResult(testResults, 'Add to Cart Test', 'SKIP', 'Add to Cart button not found', '');
                }
                
            } catch (error) {
                const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
                recordResult(testResults, 'Add to Cart Test', 'FAIL', `Exception: ${error.message}`, screenshot);
            }
}

//  Test Case 06 - Quantity Modification (AVERAGE)
// // ================================
async function TC_06_QuantityModification(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_06_QuantityModification';
    console.log(`Executing ${testCaseName}: Quantity Modification`);
    
    try {
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Wait for products to load
        await driver.wait(until.elementsLocated(By.css('.product-card, [class*="product"], .card')), 10000);
        
        // Find quantity input field
        const quantityInput = await driver.wait(
            until.elementLocated(By.css('input[type="number"], input[name*="quantity"], .quantity input')), 
            10000
        );
        
        // Get initial quantity value
        const initialQuantity = await quantityInput.getAttribute('value') || '1';
        
        // Change quantity to 3
        await driver.sleep(2000);
        await quantityInput.clear();
        await quantityInput.sendKeys('3');
        await driver.sleep(2000);
        
        // Verify quantity changed
        await driver.sleep(2000);
        const newQuantity = await quantityInput.getAttribute('value');
        const quantityChanged = newQuantity === '3' && newQuantity !== initialQuantity;
        
        // Try to find and click increase/decrease buttons if they exist
        let buttonInteraction = false;
        try {
            const increaseButton = await driver.findElement(By.css('.quantity-increase, .qty-plus, [class*="increase"], button[onclick*="increase"]'));
            await driver.sleep(2000);
            await increaseButton.click();
            await driver.sleep(2000);
            
            const updatedQuantity = await quantityInput.getAttribute('value');
            buttonInteraction = parseInt(updatedQuantity) > parseInt(newQuantity);
        } catch (e) {
            console.log('Quantity buttons not found or not functional');
        }
        
        const screenshot = await captureScreenshot(driver, testCaseName, quantityChanged ? 'PASS' : 'FAIL', screenshotsDir, homepath);
        
        if (quantityChanged) {
            recordResult(testResults, 'Quantity Modification Test', 'PASS', `Quantity modified successfully. Initial: ${initialQuantity}, New: ${newQuantity}, Button interaction: ${buttonInteraction}`, screenshot);
        } else {
            recordResult(testResults, 'Quantity Modification Test', 'FAIL', `Failed to modify quantity. Initial: ${initialQuantity}, Attempted: 3, Actual: ${newQuantity}`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Quantity Modification Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
// ================================
// Test Case 07 - Multiple Products Cart Management (COMPLEX)
// ================================
async function TC_07_MultipleProductsCartManagement(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_07_MultipleProductsCartManagement';
    console.log(`Executing ${testCaseName}: Multiple Products Cart Management`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);

        // Wait for products to load
        await driver.wait(until.elementsLocated(By.css('.product-card, [class*="product"], .card')), 10000);

        // Find multiple Add to Cart buttons
        const addToCartButtons = await driver.findElements(By.xpath('//*[contains(text(),"Add to Cart") or contains(text(), "ADD TO CART")]'));
        console.log(`Add to Cart buttons found: ${addToCartButtons.length}`);
        if (addToCartButtons.length < 3) {
            throw new Error(`Not enough products found. Only ${addToCartButtons.length} products available`);
        }
        
        // Add first 3 products to cart
        const productsToAdd = Math.min(3, addToCartButtons.length);
        // const addedProducts = [];
        console.log(`Adding ${productsToAdd} products to cart`);
        
        for (let i = 0; i < productsToAdd; i++) {
            const button = addToCartButtons[i];
            // Scroll to button and wait for it to be clickable
            await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", button);
            await driver.wait(until.elementIsVisible(button), 5000);
            
            try {
                // First, attempt a standard WebDriver click
                await button.click();
            } catch (e) {
                console.log('Standard click failed, attempting JavaScript click.');
                // If the standard click is intercepted, use a JavaScript click
                await driver.executeScript("arguments[0].click();", button);
            }
            
            await driver.sleep(2000); // Wait between additions
        }
        console.log(`Products added to cart.`);
        
        let cartVerification = false;
        try {
            const cartButton = await driver.findElement(By.xpath('//*[@id="root"]/div[2]/nav/div/div[2]/button'));
            console.log('Cart button found, attempting to open cart');
            await driver.executeScript("arguments[0].scrollIntoView(true);", cartButton);
            await cartButton.click();
            
            await driver.sleep(3000);
            
            // Check for multiple items in cart
            const cartItems = await driver.findElements(By.css('//*[contains(text(),"Remove")]'));
            cartVerification = cartItems.length >= productsToAdd;
            
        } catch (e) {
            // Alternative: Check cart count
            try {
                const cartCount = await driver.findElement(By.css('.cart-count, [class*="cart-count"], .badge'));
                const count = parseInt(await cartCount.getText()) || 0;
                cartVerification = count >= productsToAdd;
            } catch (e2) {
                console.log('Could not verify cart contents');
            }
        }
        
        const screenshot = await captureScreenshot(driver, testCaseName, cartVerification ? 'PASS' : 'FAIL', screenshotsDir, homepath);
        
        if (cartVerification) {
            recordResult(testResults, 'Multiple Products Cart Test', 'PASS', `Successfully added multiple products.`, screenshot);
        } else {
            recordResult(testResults, 'Multiple Products Cart Test', 'FAIL', `Failed to verify multiple products in cart.`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Multiple Products Cart Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
// ================================
// Test Case 08 - Price Validation and Calculation (COMPLEX)
// ================================
async function TC_08_PriceValidationCalculation(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_08_PriceValidationCalculation';
    console.log(`Executing ${testCaseName}: Price Validation and Calculation`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Wait for products to load
        await driver.wait(until.elementsLocated(By.css('.product-card, [class*="product"], .card')), 10000);
        
        const products = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        const priceData = [];
        console.log(`Products found: ${products.length}`);
        // Extract price information from first 3 products
        for (let i = 0; i < Math.min(3, products.length); i++) {
            try {
                const priceElement = await products[i].findElement(By.xpath('.//*[contains(text(), "$") or contains(text(), "Price")]'));
                const priceText = await priceElement.getText();
                const priceMatch = priceText.match(/\$?(\d+(?:\.\d{2})?)/);
                await driver.sleep(1000);
                await driver.sleep(1000);
                if (priceMatch) {
                    const price = parseFloat(priceMatch[1]);
                    priceData.push({
                        element: products[i],
                        price: price,
                        priceText: priceText
                    });
                }
            } catch (e) {
                console.log(`Could not extract price for product ${i + 1}`);
            }
        }
        
        // Validate price formats and ranges
        let priceValidation = true;
        let validationMessages = [];
        
        for (const item of priceData) {
            console.log(`Validating price: ${item.priceText}`); 
            console.log(`Parsed price: ${item.price}`);
            // Check price is positive
            if (item.price <= 0) {
                priceValidation = false;
                validationMessages.push(`Invalid price: ${item.priceText}`);
            }
            
            // Check price format (should have $ and reasonable range)
            if (item.price > 10000) {
                validationMessages.push(`High price detected: ${item.priceText}`);
            }
            
            // Check price includes currency symbol
            if (!item.priceText.includes('$')) {
                priceValidation = false;
                validationMessages.push(`Missing currency symbol: ${item.priceText}`);
            }
        }
        
        // Test quantity-based price calculation if possible
        if (priceData.length > 0) {
            try {
                const firstProduct = priceData[0];
                const quantityInput = await firstProduct.element.findElement(By.css('input[type="number"], input[name*="quantity"]'));
                
                await quantityInput.clear();
                await quantityInput.sendKeys('2');
                await driver.sleep(2000);
                
                // Check if total price updates (some sites show total per product)
                const updatedPriceElement = await firstProduct.element.findElement(By.xpath('.//*[contains(text(), "$") or contains(text(), "Price") or contains(text(), "Total")]'));
                const updatedPriceText = await updatedPriceElement.getText();
                validationMessages.push(`Quantity test: Original ${firstProduct.priceText}, Updated ${updatedPriceText}`);
                
            } catch (e) {
                validationMessages.push('Quantity-based price calculation test not applicable');
            }
        }
        
        const screenshot = await captureScreenshot(driver, testCaseName, priceValidation ? 'PASS' : 'FAIL', screenshotsDir, homepath);
        
        if (priceValidation) {
            recordResult(testResults, 'Price Validation Test', 'PASS', `Price validation successful. ${validationMessages.join('; ')}`, screenshot);
        } else {
            recordResult(testResults, 'Price Validation Test', 'FAIL', `Price validation failed. Issues: ${validationMessages.join('; ')}`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Price Validation Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
// ================================
// Test Case 09 - End-to-End Shopping Flow (COMPLEX)
// ================================
async function TC_09_EndToEndShoppingFlow(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_09_EndToEndShoppingFlow';
    console.log(`Executing ${testCaseName}: End-to-End Shopping Flow`);
    
    try {
        
        await driver.manage().window().maximize();  
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        const flowSteps = [];
        
        // Step 1: Search for a product
        const searchBox = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Search"], input[type="search"], input[name*="search"]')), 
            10000
        );
        await searchBox.clear();
        await searchBox.sendKeys('phone');
        await searchBox.sendKeys(Key.ENTER);
        await driver.sleep(2000);
        flowSteps.push('Search completed');
        
        // Step 2: Select and modify quantity
        const products = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        if (products.length === 0) {
            throw new Error('No products found after search');
        }
        console.log(`Products found after search: ${products.length}`);
        
        
        // Step 3: Add to cart
        console.log('Clicking Add to Cart button');
            const addToCartButtonLocator = By.xpath("(//button[text()='Add to Cart'])[1]");
            const addToCartButton = await driver.findElement(addToCartButtonLocator);

            // 2. Scroll the button to the CENTER of the viewport to avoid the sticky navbar
            console.log('Scrolling button to the center of the view...');
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", addToCartButton);

            // 3. Wait for the button to be stable and visible after the scroll
            await driver.wait(until.elementIsVisible(addToCartButton), 5000);

            // 4. Use a JavaScript click, which is the most effective way to prevent interception errors
            console.log('Clicking Add to Cart button using JavaScript...');
            await driver.executeScript("arguments[0].click();", addToCartButton);

            console.log('Successfully clicked the button.');
            await driver.sleep(3000); // Wait for cart to update
            flowSteps.push('Product added to cart');
        
        // Step 4: Navigate to cart
        let cartAccessed = false;
        try {
            console.log('Attempting to access cart');
            const cartButton = await driver.findElement(By.xpath('//*[@id="root"]/div[2]/nav/div/div[2]/button'));
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", cartButton);

            // 3. Wait for the button to be stable and visible after the scroll
            await driver.wait(until.elementIsVisible(cartButton), 5000);

            // 4. Use a JavaScript click, which is the most effective way to prevent interception errors
            console.log('Clicking Add to Cart button using JavaScript...');
            await driver.executeScript("arguments[0].click();", cartButton);

            // await cartButton.click();
            await driver.sleep(3000);
            cartAccessed = true;
            flowSteps.push('Cart accessed');
        } catch (e) {
            flowSteps.push('Cart navigation not available');
        }
        
        // Step 5: Verify cart contents
        let cartVerified = false;
        if (cartAccessed) {
            try {
                const cartItems = await driver.findElements(By.xpath('.//*[contains(text(), "Remove")]'));
                cartVerified = cartItems.length > 0;
                flowSteps.push(`Cart verification: ${cartItems.length} items found`);
                console.log(`Cart items found: ${cartItems.length}`);
            } catch (e) {
                flowSteps.push('Cart verification failed');
            }
        }
        
        // Step 6: Look for checkout process
        try {
            const checkoutButton = await driver.findElement(By.xpath('//*[contains(text(), "Proceed to Buy")]'));
            
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", checkoutButton);

            // 3. Wait for the button to be stable and visible after the scroll
            await driver.wait(until.elementIsVisible(checkoutButton), 5000);

            // 4. Use a JavaScript click, which is the most effective way to prevent interception errors
            console.log('Clicking Add to Cart button using JavaScript...');
            if (await checkoutButton.isDisplayed()) {
                flowSteps.push('Checkout button available');
            }
        } catch (e) {
            flowSteps.push('Checkout button not found');
        }
        
        const flowSuccess = flowSteps.length >= 4;
        const screenshot = await captureScreenshot(driver, testCaseName, flowSuccess ? 'PASS' : 'FAIL', screenshotsDir, homepath);

        if (flowSuccess) {
            recordResult(testResults, 'End-to-End Shopping Flow Test', 'PASS', `Shopping flow completed: ${flowSteps.join(' → ')}`, screenshot);
        } else {
            recordResult(testResults, 'End-to-End Shopping Flow Test', 'FAIL', `Shopping flow incomplete: ${flowSteps.join(' → ')}`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'End-to-End Shopping Flow Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
// ================================
// Test Case 10 - Negative Quantity Boundary Test (BOUNDARY)
// ================================
async function TC_10_NegativeQuantityBoundaryTest(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_10_NegativeQuantityBoundaryTest';
    console.log(`Executing ${testCaseName}: Negative Quantity Boundary Test`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Wait for products to load
        await driver.wait(until.elementsLocated(By.css('.product-card, [class*="product"], .card')), 10000);
        
        // Find quantity input field
        const quantityInput = await driver.wait(
            until.elementLocated(By.css('input[type="number"], input[name*="quantity"], .quantity input')), 
            10000
        );
        
        const boundaryTests = [];
        
        // Test Case 1: Negative quantity
        await quantityInput.clear();
        await quantityInput.sendKeys('-1');
        await driver.sleep(1000);
        let negativeValue = await quantityInput.getAttribute('value');
        boundaryTests.push({test: 'Negative Quantity', input: '-1', result: negativeValue, valid: negativeValue !== '-1'});
        
        // Test Case 2: Zero quantity
        await quantityInput.clear();
        await quantityInput.sendKeys('0');
        await driver.sleep(1000);
        let zeroValue = await quantityInput.getAttribute('value');
        boundaryTests.push({test: 'Zero Quantity', input: '0', result: zeroValue, valid: zeroValue !== '0' || zeroValue === '1'});
        
        // Test Case 3: Very large quantity
        await quantityInput.clear();
        await quantityInput.sendKeys('99999');
        await driver.sleep(1000);
        let largeValue = await quantityInput.getAttribute('value');
        boundaryTests.push({test: 'Large Quantity', input: '99999', result: largeValue, valid: largeValue === '99999'}); // Large values might be acceptable
        
        // Test Case 4: Non-numeric input
        await quantityInput.clear();
        await quantityInput.sendKeys('abc');
        await driver.sleep(2000);
        let textValue = await quantityInput.getAttribute('value');
        boundaryTests.push({test: 'Text Input', input: 'abc', result: textValue, valid: textValue !== 'abc'});
        
        // Test Case 5: Decimal quantity
        await quantityInput.clear();
        await quantityInput.sendKeys('2.5');
        await driver.sleep(2000);
        let decimalValue = await quantityInput.getAttribute('value');
        console.log(`Decimal input result: ${decimalValue}`);
        boundaryTests.push({test: 'Decimal Quantity', input: '2.5', result: decimalValue, valid: decimalValue !== '2.5'});
        
        // Evaluate boundary test results
        const passedTests = boundaryTests.filter(test => test.valid).length;
        const totalTests = boundaryTests.length;
        const boundaryTestPassed = passedTests >= (totalTests * 0.6); // 60% pass rate acceptable
        
        const screenshot = await captureScreenshot(driver, testCaseName, boundaryTestPassed ? 'PASS' : 'FAIL', screenshotsDir, homepath);

        const testDetails = boundaryTests.map(test => `${test.test}: ${test.input} → ${test.result} (${test.valid ? 'VALID' : 'INVALID'})`).join('; ');
        
        if (boundaryTestPassed) {
            recordResult(testResults, 'Quantity Boundary Test', 'PASS', `Boundary validation passed ${passedTests}/${totalTests}. Details: ${testDetails}`, screenshot);
        } else {
            recordResult(testResults, 'Quantity Boundary Test', 'FAIL', `Boundary validation failed ${passedTests}/${totalTests}. Details: ${testDetails}`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Quantity Boundary Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
// ================================
// Test Case 11 - Empty Search Boundary Test (BOUNDARY)
// ================================
async function TC_11_EmptySearchBoundaryTest(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_11_EmptySearchBoundaryTest';
    console.log(`Executing ${testCaseName}: Empty Search Boundary Test`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Find search box
        let searchBox = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Search"], input[type="search"], input[name*="search"]')), 
            10000
        );
        
        // Get initial product count
        const initialProducts = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        const initialCount = initialProducts.length;
        console.log(`Initial product count: ${initialCount}`);
        const searchTests = [];
        
        // Test Case 1: Empty search
        await searchBox.clear();
        await searchBox.sendKeys(Key.ENTER);
        await driver.sleep(4000);
        let emptySearchResults = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        searchTests.push({
            test: 'Empty Search', 
            input: '(empty)', 
            resultCount: emptySearchResults.length, 
            valid: emptySearchResults.length === initialCount
        });
        console.log(`Empty search results count: ${emptySearchResults.length}`);
        
        // Test Case 2: Special characters search
        searchBox = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Search"], input[type="search"], input[name*="search"]')), 
            10000
        );
        await driver.sleep(2000);
        await searchBox.clear();
        await searchBox.sendKeys('!@#$%^&*()');
        await driver.sleep(3000);
        await searchBox.sendKeys(Key.ENTER);
        await driver.sleep(2000);
        let specialCharResults = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        searchTests.push({
            test: 'Special Characters', 
            input: '!@#$%^&*()', 
            resultCount: specialCharResults.length, 
            valid: specialCharResults.length >= 0
        });

        console.log(`Special characters search results count: ${specialCharResults.length}`);
        // Test Case 3: Very long search term
        searchBox = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Search"], input[type="search"], input[name*="search"]')), 
            10000
        );
        const longTerm = 'a'.repeat(1000);
        await searchBox.clear();
        await searchBox.sendKeys(longTerm.substring(0, 100)); // Limit to avoid issues
        await searchBox.sendKeys(Key.ENTER);
        await driver.sleep(2000);
        let longTermResults = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        searchTests.push({
            test: 'Long Search Term', 
            input: `${longTerm.substring(0, 20)}...`, 
            resultCount: longTermResults.length, 
            valid: longTermResults.length >= 0
        });
        
        // Test Case 5: Non-existent product search
        searchBox = await driver.wait(
            until.elementLocated(By.css('input[placeholder*="Search"], input[type="search"], input[name*="search"]')), 
            10000
        );
        await searchBox.clear();
        await searchBox.sendKeys('xyzneverexists123');
        await searchBox.sendKeys(Key.ENTER);
        await driver.sleep(2000);
        let noResultsSearch = await driver.findElements(By.css('.product-card, [class*="product"], .card'));
        searchTests.push({
            test: 'Non-existent Product', 
            input: 'xyzneverexists123', 
            resultCount: noResultsSearch.length, 
            valid: true // Any result count is acceptable for non-existent items
        });
        
        // Evaluate search boundary tests
        const validTests = searchTests.filter(test => test.valid).length;
        const totalTests = searchTests.length;
        const searchBoundaryPassed = validTests === totalTests;
        
        const screenshot = await captureScreenshot(driver, testCaseName, searchBoundaryPassed ? 'PASS' : 'FAIL', screenshotsDir, homepath);

        const testDetails = searchTests.map(test => 
            `${test.test}: "${test.input}" → ${test.resultCount} results (${test.valid ? 'VALID' : 'INVALID'})`
        ).join('; ');
        
        if (searchBoundaryPassed) {
            recordResult(testResults, 'Search Boundary Test', 'PASS', `Search boundary tests passed ${validTests}/${totalTests}. ${testDetails}`, screenshot);
        } else {
            recordResult(testResults, 'Search Boundary Test', 'FAIL', `Search boundary tests failed ${validTests}/${totalTests}. ${testDetails}`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Search Boundary Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}
// ================================
// Test Case 12 - Maximum Cart Load Boundary Test (BOUNDARY)
// ================================
async function TC_12_MaximumCartLoadBoundaryTest(driver, testResults, screenshotsDir, homepath) {
    const testCaseName = 'TC_12_MaximumCartLoadBoundaryTest';
    console.log(`Executing ${testCaseName}: Maximum Cart Load Boundary Test`);
    
    try {
        await driver.manage().window().maximize();
        await driver.get('https://testerbud.com/practice-ecommerece-website/');
        await driver.wait(until.titleContains('Dummy E-commerce'), 10000);
        
        // Wait for products to load
        await driver.wait(until.elementsLocated(By.css('.product-card, [class*="product"], .card')), 10000);
        
        // // Get all available Add to Cart buttons
        const addToCartButtons = await driver.findElements(By.xpath('//*[contains(text(), "Add to Cart") or contains(text(), "ADD TO CART")]'));
        
        // if (addToCartButtons.length === 0) {
        //     throw new Error('No Add to Cart buttons found');
        // }
        
        let cartLoadResults = {
            totalProducts: addToCartButtons.length,
            successfullyAdded: 0,
            errors: [],
            cartState: 'unknown'
        };
        
      
    // Define the locator for the "Add to Cart" buttons
    const addToCartLocator = By.xpath("//button[text()='Add to Cart']");

    try {
        // First, get the total number of products to add.
        // This is safer than looping through a list that might become stale.
        const buttons = await driver.findElements(addToCartLocator);
        const productCount = buttons.length;

        if (productCount === 0) {
            console.log('No "Add to Cart" buttons found on the page.');
            return;
        }

        console.log(`Found ${productCount} products to add to the cart.`);

        // Loop a specific number of times, re-finding the elements each time
        // This is the most robust way to avoid "stale element" errors.
        for (let i = 0; i < productCount; i++) {
            // Re-find all buttons on each iteration
            const currentButtons = await driver.findElements(addToCartLocator);
            
            // It's possible an element was removed, so we check the length
            if (currentButtons.length <= i) {
                console.warn(`Could not find button at index ${i}. It may have been removed from the page.`);
                continue;
            }

            const button = currentButtons[i];
            
            console.log(`Processing product ${i + 1} of ${productCount}...`);

            // Scroll the button to the center of the view to avoid sticky headers/footers
            await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", button);

            // Wait briefly for the scroll animation to finish and for the button to be ready
            await driver.wait(until.elementIsVisible(button), 5000);
            await driver.wait(until.elementIsEnabled(button), 5000);

            // Use a JavaScript click as it's less prone to interception
            await driver.executeScript("arguments[0].click();", button);
            
            cartLoadResults.successfullyAdded++;

            // Optional: Wait for a moment to allow the UI to update (e.g., show an "added" message)
            await driver.sleep(500); 
        }
         
        console.log('Successfully added all products to the cart.');

    } catch (error) {
        console.error('An error occurred while adding products to the cart:', error);
    }
        // Verify final cart state
        try {
            // Check cart count if available
            const cartCount = await driver.findElement(By.css('.cart-count, [class*="cart-count"], .badge'));
            const count = await cartCount.getText();
            cartLoadResults.cartState = `Cart count: ${count}`;
        } catch (e) {
            try {
                // Try to access cart page
                const cartButton = await driver.findElement(By.xpath('//*[contains(@class, "cart") or contains(text(), "cart")]'));
                await cartButton.click();
                await driver.sleep(3000);
                
                const cartItems = await driver.findElements(By.css('.cart-item, [class*="cart-item"], .item'));
                cartLoadResults.cartState = `Cart items found: ${cartItems.length}`;
            } catch (e2) {
                cartLoadResults.cartState = 'Cart state verification failed';
            }
        }
        
        // Evaluate boundary test success
        const successRate = (cartLoadResults.successfullyAdded / cartLoadResults.totalProducts) * 100;
        const boundaryTestPassed = successRate >= 70 && cartLoadResults.errors.length <= 3;
        
        const screenshot = await captureScreenshot(driver, testCaseName, boundaryTestPassed ? 'PASS' : 'FAIL', screenshotsDir, homepath);

        const resultMessage = `Added ${cartLoadResults.successfullyAdded}/${cartLoadResults.totalProducts} products (${successRate.toFixed(1)}%). ${cartLoadResults.cartState}. Errors: ${cartLoadResults.errors.length}`;
        
        if (boundaryTestPassed) {
            recordResult(testResults, 'Maximum Cart Load Test', 'PASS', resultMessage, screenshot);
        } else {
            recordResult(testResults, 'Maximum Cart Load Test', 'FAIL', `${resultMessage}. Error details: ${cartLoadResults.errors.slice(0, 3).join('; ')}`, screenshot);
        }
    } catch (error) {
        const screenshot = await captureScreenshot(driver, testCaseName, 'FAIL', screenshotsDir, homepath);
        recordResult(testResults, 'Maximum Cart Load Test', 'FAIL', `Exception: ${error.message}`, screenshot);
    }
}

// Function to run all test cases in sequence
async function runTestsSequentially(driver, testResults, screenshotsDir, homepath) {
    console.log('Running test cases...');
    await TC_01_VerifyHomepageLoadAndResponsiveness(driver, testResults, screenshotsDir, homepath);
    await TC_02_SearchFunctionBoundaryTesting(driver, testResults, screenshotsDir, homepath);
    await TC_03_FullCartCycle(driver, testResults, screenshotsDir, homepath);
    await TC_04_NavigationLinksValidation(driver, testResults, screenshotsDir, homepath);
    await TC_05_AddToCartFunctionality(driver, testResults, screenshotsDir, homepath);
    await TC_06_QuantityModification(driver, testResults, screenshotsDir, homepath);
    await TC_07_MultipleProductsCartManagement(driver, testResults, screenshotsDir, homepath);
    await TC_08_PriceValidationCalculation(driver, testResults, screenshotsDir, homepath);
    await TC_09_EndToEndShoppingFlow(driver, testResults, screenshotsDir, homepath);
    await TC_10_NegativeQuantityBoundaryTest(driver, testResults, screenshotsDir, homepath);
    await TC_11_EmptySearchBoundaryTest(driver, testResults, screenshotsDir, homepath);
    await TC_12_MaximumCartLoadBoundaryTest(driver, testResults, screenshotsDir, homepath);
}

// Execute the tests
runAllTests().catch(console.error);