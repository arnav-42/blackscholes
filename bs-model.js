function normalCDF(value) {
    const c = 0.2316419;
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const t = 1 / (1 + c * Math.abs(value));
    const z = Math.exp(-value * value / 2) / Math.sqrt(2 * Math.PI);
    const term = t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5))));
    return value < 0 ? (1 - z * term) : (z * term);
}

function blackScholes(S, K, T, r, sigma) {
    r /= 100;  // Convert to decimal
    sigma /= 100;  // Convert to decimal
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(-d2);
}

function updateBSM() {
    const S = parseFloat(document.getElementById('underlyingPrice').value);
    const K = parseFloat(document.getElementById('strikePrice').value);
    const T = parseFloat(document.getElementById('timeToExpiry').value);
    const r = parseFloat(document.getElementById('riskFreeRate').value);
    const sigma = parseFloat(document.getElementById('volatility').value);
    
    document.getElementById('underlyingPriceOutput').textContent = S;
    document.getElementById('strikePriceOutput').textContent = K;
    document.getElementById('timeToExpiryOutput').textContent = T;
    document.getElementById('riskFreeRateOutput').textContent = r;
    document.getElementById('volatilityOutput').textContent = sigma;
    
    const callPrice = blackScholes(S, K, T, r, sigma);
    document.getElementById('callPrice').textContent = callPrice.toFixed(2);
}

window.onload = updateBSM;  // Calculate initial value on page load
