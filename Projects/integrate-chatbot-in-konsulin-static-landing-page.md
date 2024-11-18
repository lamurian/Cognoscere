---
author: Lam
date: 2024-11-02T08:39:15+01:00
title: Integrate chatbot in Konsulin static landing page
source: https://chatgpt.com/share/de00b1f2-7524-489a-a369-74db787ec962
tags:
- tech
- konsulin
---

To implement the chatbot widget with the desired functionality, we'll break down the task into two main parts: **Backend (Golang)** and **Frontend (Hugo + Tailwind CSS + JavaScript)**. The solution will involve setting up a Go server to handle requests to the ChatGPT API, and integrating a frontend widget into your Hugo static site.

### Backend: Golang Server

This backend will serve as an intermediary between the frontend and the OpenAI ChatGPT API. It will handle incoming requests, communicate with the ChatGPT API, and return the responses.

#### 1. Setup Golang Project

Initialize a new Go project.

```bash
mkdir chatbot-backend
cd chatbot-backend
go mod init lyna.konsulin.care/chatbot
```

#### 2. Implement the Golang Server

Create a `main.go` file:

```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"bytes"
)

type ChatRequest struct {
	Prompt string `json:"prompt"`
}

type ChatResponse struct {
	Response string `json:"response"`
}

func chatHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var chatReq ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&chatReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Make request to OpenAI ChatGPT API
	openAIResponse, err := getChatGPTResponse(chatReq.Prompt)
	if err != nil {
		http.Error(w, "Failed to get response from ChatGPT", http.StatusInternalServerError)
		return
	}

	// Send response back to the frontend
	chatRes := ChatResponse{Response: openAIResponse}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(chatRes); err != nil {
		http.Error(w, "Failed to send response", http.StatusInternalServerError)
		return
	}
}

func getChatGPTResponse(prompt string) (string, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	requestBody, err := json.Marshal(map[string]interface{}{
		"model": "gpt-3.5-turbo",
		"messages": []map[string]string{
			{"role": "system", "content": "You are a helpful assistant."},
			{"role": "user", "content": prompt},
		},
	})
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	if choices, ok := result["choices"].([]interface{}); ok && len(choices) > 0 {
		if choice, ok := choices[0].(map[string]interface{}); ok {
			return choice["message"].(map[string]interface{})["content"].(string), nil
		}
	}

	return "", nil
}

func main() {
	http.HandleFunc("/chat", chatHandler)

	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
```

#### 3. Environment Configuration

Ensure the OpenAI API key is set as an environment variable on your server:

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

#### 4. Build and Deploy

Build your Go application:

```bash
go build -o chatbot-backend
```

Then, deploy this binary to your server and run it.

### Frontend: Hugo + Tailwind CSS + JavaScript

Now, let's add the chatbot widget to your Hugo site.

#### 1. Add Tailwind CSS (if not already present)

Ensure Tailwind CSS is set up in your Hugo project. This might be through a `tailwind.config.js` or simply via a CDN.

#### 2. Create a Partial for the Chat Widget

Add a new partial in `layouts/partials/chatbot.html`:

```html
<div id="chatbot-widget" class="fixed bottom-4 right-4 z-50">
    <button id="chatbot-button" class="bg-blue-500 text-white p-4 rounded-full shadow-lg">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26c.21.14.48.14.69 0L21 8M3 8l7.89 5.26c.21.14.48.14.69 0L21 8l-9 6.04L3 8zm0 0V6a2 2 0 012-2h14a2 2 0 012 2v2"/>
        </svg>
    </button>
    <div id="chatbox" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-96 h-96 flex flex-col">
            <div id="chatbox-messages" class="flex-grow overflow-y-auto mb-4 p-2 border rounded">
                <!-- Chat messages go here -->
            </div>
            <input id="chatbox-input" class="border p-2 rounded w-full" type="text" placeholder="Type your message...">
            <button id="chatbox-send" class="bg-blue-500 text-white mt-2 p-2 rounded">Send</button>
            <button id="chatbox-close" class="text-gray-500 mt-2 p-2">Close</button>
        </div>
    </div>
</div>
```

#### 3. Include the Partial in Your Hugo Layout

In the base template, typically found in `layouts/_default/baseof.html`, include the chatbot partial just before the closing `</body>` tag:

```html
{{ partial "chatbot.html" . }}
```

#### 4. Add JavaScript to Handle Chatbot Interaction

Add the following JavaScript to your `assets/js/chatbot.js`:

```javascript
document.addEventListener("DOMContentLoaded", function() {
    const chatbotButton = document.getElementById("chatbot-button");
    const chatbox = document.getElementById("chatbox");
    const chatboxClose = document.getElementById("chatbox-close");
    const chatboxSend = document.getElementById("chatbox-send");
    const chatboxMessages = document.getElementById("chatbox-messages");
    const chatboxInput = document.getElementById("chatbox-input");

    chatbotButton.addEventListener("click", () => {
        chatbox.classList.remove("hidden");
    });

    chatboxClose.addEventListener("click", () => {
        chatbox.classList.add("hidden");
    });

    chatboxSend.addEventListener("click", async () => {
        const userMessage = chatboxInput.value.trim();
        if (!userMessage) return;

        addMessageToChat("user", userMessage);
        chatboxInput.value = "";

        try {
            const response = await fetch("https://lyna.konsulin.care/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: userMessage })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            addMessageToChat("bot", data.response);
        } catch (error) {
            console.error("Failed to fetch the chat response:", error);
            addMessageToChat("bot", "Sorry, something went wrong.");
        }
    });

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("p-2", "mb-2", "rounded", "border");
        messageElement.classList.add(sender === "user" ? "bg-blue-100" : "bg-gray-100");
        messageElement.textContent = message;
        chatboxMessages.appendChild(messageElement);
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    }
});
```

Finally, ensure this JavaScript is included in your Hugo templates. If you are using Hugo Pipes or another bundling method, include it accordingly. Otherwise, add a script tag:

```html
<script src="/js/chatbot.js"></script>
```

### Deployment

1. **Backend**: Deploy your Go server on your dedicated server under the subdomain `lyna.konsulin.care`.
2. **Frontend**: Ensure the Hugo site is built and deployed as usual, with the chatbot widget and scripts included.

### Conclusion

This setup will provide a chatbot widget on your Hugo site, which connects to a Go backend, that in turn interacts with the ChatGPT API. The widget's UI is handled by Tailwind CSS, and the interaction
