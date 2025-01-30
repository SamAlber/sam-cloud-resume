/************************************************************************
 * ✅ Update Counter (Viewer Count)
 ************************************************************************/
const counter = document.querySelector(".counter-number"); // Select the element displaying the viewer count.

// Function to fetch and update the viewer count from the API.
async function updateCounter() {
    try {
        let response = await fetch("https://zyst4gczkf.execute-api.us-east-1.amazonaws.com/prod/viewer-count");
        let data = await response.json();
        counter.innerHTML = `Views: ${data.view_count}`; // Update the counter with the new view count.
    } catch (error) {
        console.error("Error fetching viewer count:", error);
    }
}

// Call the function on page load.
updateCounter();

/************************************************************************
 * ✅ Fetch and Display Cryptocurrency Prices
 ************************************************************************/
async function fetchCryptoPrices() {
    const apiEndpoint = "https://zyst4gczkf.execute-api.us-east-1.amazonaws.com/prod/crypto_api";
    const symbols = "BTC,ETH,BNB,LTC,DOGE,NEO,ADA,SOL,XRP,TRX"; // Supported cryptocurrencies.

    // Mapping cryptocurrency symbols to their respective logo URLs.
    const cryptoLogos = {
        BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
        ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
        BNB: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
        LTC: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
        DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
        NEO: "https://cryptologos.cc/logos/neo-neo-logo.png",
        ADA: "https://cryptologos.cc/logos/cardano-ada-logo.png",
        SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
        XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
        TRX: "https://cryptologos.cc/logos/tron-trx-logo.png",
    };

    try {
        const response = await fetch(`${apiEndpoint}?symbols=${symbols}`);
        const data = await response.json();
        
        if (data.prices) {
            const cryptoBar = document.getElementById("crypto-bar");
            cryptoBar.innerHTML = ""; // Clear existing content.
            
            // Populate the crypto bar with price data.
            for (const [symbol, price] of Object.entries(data.prices)) {
                const item = document.createElement("div");
                item.className = "crypto-item";

                const icon = document.createElement("img");
                icon.src = cryptoLogos[symbol] || "https://via.placeholder.com/40";
                icon.alt = `${symbol} logo`;
                icon.style.width = "40px";
                icon.style.height = "40px";

                const name = document.createElement("div");
                name.className = "crypto-name";
                name.textContent = symbol;

                const priceElement = document.createElement("div");
                priceElement.className = "crypto-price";
                priceElement.textContent = `$${price.toFixed(2)}`;

                item.appendChild(icon);
                item.appendChild(name);
                item.appendChild(priceElement);
                cryptoBar.appendChild(item);
            }
        } else {
            console.error("No prices found in response");
        }
    } catch (error) {
        console.error("Error fetching crypto prices:", error);
    }
}

// Fetch the cryptocurrency prices on page load.
fetchCryptoPrices();

/************************************************************************
 * ✅ Email Sending Functionality
 ************************************************************************/
async function sendEmailRequest() {
    const emailInput = document.getElementById("email-input");
    const email = emailInput.value.trim();
    const statusDiv = document.getElementById("email-status");
    
    statusDiv.textContent = ""; // Clear previous messages.
    
    if (!validateEmail(email)) {
        statusDiv.textContent = "Please enter a valid email address.";
        statusDiv.style.color = "red";
        return;
    }
    
    const apiEndpoint = "https://zyst4gczkf.execute-api.us-east-1.amazonaws.com/prod/send-cv";
    
    try {
        statusDiv.textContent = "Sending request...";
        statusDiv.style.color = "blue";
        
        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        
        const result = await response.json();
        
        statusDiv.textContent = response.ok ? "CV link sent successfully! Check your email." : (result.error || "Failed to send CV. Please try again.");
        statusDiv.style.color = response.ok ? "green" : "red";
    } catch (error) {
        console.error("Error sending email:", error);
        statusDiv.textContent = "An error occurred. Please try again.";
        statusDiv.style.color = "red";
    }
}

// Function to validate email format.
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/************************************************************************
 * ✅ Cognito Authentication and Redirect Handling
 ************************************************************************/
const COGNITO_DOMAIN = "us-east-1vtzspvjtr.auth.us-east-1.amazoncognito.com";
const CLIENT_ID = "4667m5rgdiql8qs0kv8aseesvd";
const REDIRECT_URI = "https://samuelalber.com";

// Handle authentication and remove "code" from URL.
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get("code");

    if (authCode) {
        exchangeCodeForTokens(authCode);
        window.history.replaceState({}, document.title, window.location.pathname); // Remove "code" from the URL.
    }

    // Handle Login Button Click
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.onclick = () => {
            window.location.href = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=email+openid+profile`;
        };
    }

    // Handle Download Button Click (inside popup)
    const popupDownloadButton = document.getElementById("popup-download-cv-btn");
    if (popupDownloadButton) {
        popupDownloadButton.onclick = () => {
            window.location.href = "https://public-cv-bra2hd.s3.us-east-1.amazonaws.com/CV-SamuelAlbershtein.pdf";
        };
    }

    // Handle Popup Close Button
    const closePopupButton = document.getElementById("close-popup");
    if (closePopupButton) {
        closePopupButton.onclick = () => {
            document.getElementById("success-popup").style.display = "none";
        };
    }
});

// Function to exchange authorization code for tokens.
async function exchangeCodeForTokens(code) {
    try {
        const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: CLIENT_ID,
                code: code,
                redirect_uri: REDIRECT_URI
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const tokens = await response.json();
        const payload = parseJwt(tokens.id_token);
        document.getElementById("popup-user-name").textContent = payload.name || "User";
        document.getElementById("success-popup").style.display = "block";
    } catch (error) {
        console.error("Token exchange error:", error);
    }
}

// Function to parse JWT token.
function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}
