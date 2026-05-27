import fetch from 'node-fetch'; // or built-in fetch if supported

const apiKey = 'AIzaSyAXG2F2P6NwJbsH-CfabbeoR0BVU859MTA';

async function testModel(modelName) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  console.log(`Testing model: ${modelName}...`);
  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hello, respond with exactly "OK" if you hear me.' }] }],
        generationConfig: {
          maxOutputTokens: 10,
          temperature: 0.7
        }
      })
    });
    
    console.log(`Response status for ${modelName}:`, response.status);
    const data = await response.json();
    if (response.ok) {
      console.log(`Success! Response text:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      console.error(`Error details:`, JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error(`Fetch error:`, e.message);
  }
  console.log('-----------------------------------');
}

async function run() {
  await testModel('gemini-2.5-flash');
  await testModel('gemini-2.0-flash');
  await testModel('gemini-1.5-flash');
}

run();
