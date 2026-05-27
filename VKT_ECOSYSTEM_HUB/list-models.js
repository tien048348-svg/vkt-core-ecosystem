import fetch from 'node-fetch';

const apiKey = 'AIzaSyAXG2F2P6NwJbsH-CfabbeoR0BVU859MTA';

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    console.log("Status:", response.status);
    const data = await response.json();
    if (response.ok) {
      console.log("Models list:");
      data.models.forEach(m => {
        console.log(`- Name: ${m.name}, DisplayName: ${m.displayName}, SupportedMethods: ${m.supportedGenerationMethods.join(', ')}`);
      });
    } else {
      console.error("Error:", data);
    }
  } catch (e) {
    console.error("Error fetching models:", e.message);
  }
}

listModels();
