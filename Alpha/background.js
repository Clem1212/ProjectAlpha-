chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'getSuggestion') {
    const prompt = `Correct grammar and suggest improvements:\n\n${message.text}`;
    try {
      const response = await fetch('YOUR_AI_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.7
        })
      });
      const data = await response.json();
      sendResponse({ suggestion: data.choices[0].message.content.trim() });
    } catch (err) {
      sendResponse({ suggestion: null });
    }
    return true; // Keep channel open for async response
  }
});
chrome.runtime.onInstalled.addListener(() => {
  console.log('ReplyPal extension installed');
});
