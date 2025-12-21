// src/utils/networkUtils.js

export async function checkNetworkCapabilities() {
    const capabilities = {
        online: navigator.onLine,
        connectionType: null,
        networkInformation: null,
        websocketSupport: typeof WebSocket !== 'undefined',
        sslSupport: location.protocol === 'https:',
        serviceWorkerSupport: 'serviceWorker' in navigator
    };

    // Check for Network Information API
    if ('connection' in navigator) {
        const conn = navigator.connection;
        capabilities.networkInformation = {
            type: conn.type,
            effectiveType: conn.effectiveType,
            downlinkMax: conn.downlinkMax,
            rtt: conn.rtt,
            saveData: conn.saveData
        };
    }

    // Test basic fetch capability
    try {
        const testFetch = await fetch('https://firestore.googleapis.com/', {
            method: 'HEAD',
            mode: 'no-cors'
        });
        capabilities.canReachFirestore = true;
    } catch (error) {
        capabilities.canReachFirestore = false;
        capabilities.firestoreError = error.message;
    }

    console.log('📱 Network capabilities:', capabilities);
    return capabilities;
}

export function setupNetworkMonitoring() {
    // Monitor online/offline events
    window.addEventListener('online', () => {
        console.log('🌐 Device went online');
        checkNetworkCapabilities();
    });

    window.addEventListener('offline', () => {
        console.log('📴 Device went offline');
        checkNetworkCapabilities();
    });

    // Monitor connection changes if supported
    if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
            console.log('📶 Network connection changed');
            checkNetworkCapabilities();
        });
    }

    // Initial check
    return checkNetworkCapabilities();
}