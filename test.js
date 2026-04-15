async function checkAvailableModels() {
    const apiKey = "AIzaSyATkMTqMMA-Obv7sP8i97CNROuz3COzD_k"; // Paste your actual AIzaSy... key here
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    console.log("Asking Google what models this key can use...");
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            console.log("\n✅ SUCCESS! Your key has access to these models:");
            data.models.forEach(m => console.log("-", m.name));
        } else {
            console.log("\n❌ API Error Response:", data);
        }
    } catch (error) {
        console.error("Failed to connect:", error.message);
    }
}

checkAvailableModels();