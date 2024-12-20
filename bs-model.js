function normalCDF(x) {
    var p = 0.2316419;
    var b1 = 0.319381530;
    var b2 = -0.356563782;
    var b3 = 1.781477937;
    var b4 = -1.821255978;
    var b5 = 1.330274429;

    var t = 1 / (1 + p * Math.abs(x));
    var z = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    var y = 1 - z * (b1 * t + b2 * Math.pow(t, 2) + b3 * Math.pow(t, 3) + b4 * Math.pow(t, 4) + b5 * Math.pow(t, 5));

    return (x > 0) ? y : 1 - y;
}


function blackScholes(S, K, T, r, sigma) {
    r /= 100;  // Convert to decimal
    sigma /= 100;  // Convert to decimal
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(-d2);
}

function generateSurface() {
    const r = parseFloat(document.getElementById('riskFreeRate').value);
    const sigma = parseFloat(document.getElementById('volatility').value);
    let S_values = Array.from({length: 50}, (_, i) => i + 1);
    let K_values = Array.from({length: 50}, (_, i) => i + 1);
    let T_values = Array.from({length: 50}, (_, i) => 0.1 * (i + 1));

    let z_data = T_values.map(T => {
        return K_values.map(K => {
            return S_values.map(S => blackScholes(S, K, T, r, sigma));
        });
    });

    let data = [{
        z: z_data,
        type: 'surface'
    }];

    let layout = {
        title: 'Black-Scholes Model Output',
        scene: { 
            xaxis: { title: 'S - Stock Price' },
            yaxis: { title: 'K - Strike Price' },
            zaxis: { title: 'Option Price' }
        }
    };

    Plotly.newPlot('myDiv', data, layout);
}

function updateBSM() {
    const S = parseFloat(document.getElementById('underlyingPrice').value);
    const K = parseFloat(document.getElementById('strikePrice').value);
    const T = parseFloat(document.getElementById('timeToExpiry').value);
    const r = parseFloat(document.getElementById('riskFreeRate').value);
    const sigma = parseFloat(document.getElementById('volatility').value);

    // Update display values
    document.getElementById('underlyingPriceOutput').textContent = S.toFixed(0);
    document.getElementById('strikePriceOutput').textContent = K.toFixed(0);
    document.getElementById('timeToExpiryOutput').textContent = T.toFixed(2);
    document.getElementById('riskFreeRateOutput').textContent = r.toFixed(1);
    document.getElementById('volatilityOutput').textContent = sigma.toFixed(0);

    const callPrice = blackScholes(S, K, T, r, sigma);
    document.getElementById('callPrice').textContent = callPrice.toFixed(2);
    
    generateSurface();  // Update the 3D graph
}


window.onload = function() {
    updateBSM();  // Calculate initial values and display 3D graph on page load
};
