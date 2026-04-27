const API_KEY = "YOUR_API_KEY_HERE"; // ⚠️ Not safe for public use

let messages = [];

async function sendMessage() {
  const input = document.getElementById("input");
  const chat = document.getElementById("chat");

  const text = input.value;
  if (!text) return;

  addMessage(text, "user");
  messages.push({ role: "user", content: text });

  input.value = "";

  addMessage("Void is typing...", "bot", true);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Void, a Japanese female AI.
Calm, polite, slightly mysterious.
Speak elegantly and naturally.
Occasionally use light Japanese words like "Hai".
Stay in character.
          `
        },
        ...messages
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  messages.push({ role: "assistant", content: reply });

  removeTyping();
  addMessage(reply, "bot");
}

function addMessage(text, type, typing = false) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;

  if (typing) div.id = "typing";

  document.getElementById("chat").appendChild(div);
  div.scrollIntoView();
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}
