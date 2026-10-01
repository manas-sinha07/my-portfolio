document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("ai-chat-button");
    const panel = document.getElementById("ai-chat-panel");
    const closeButton = document.getElementById("ai-chat-close");
    const form = document.getElementById("ai-chat-form");
    const input = document.getElementById("ai-chat-input");
    const messages = document.getElementById("ai-chat-messages");
    const sendButton = document.getElementById("ai-chat-send");

    if (!button || !panel || !closeButton || !form || !input || !messages || !sendButton) {
        return;
    }

    let previousInteractionId = null;

    function addMessage(text, role) {
        const message = document.createElement("div");

        message.className = `ai-message ${role}`;
        message.textContent = text;

        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;

        return message;
    }

    function openChat() {
        panel.classList.add("open");
        panel.setAttribute("aria-hidden", "false");

        setTimeout(() => {
            input.focus();
        }, 100);
    }

    function closeChat() {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
    }

    button.addEventListener("click", () => {
        if (panel.classList.contains("open")) {
            closeChat();
        } else {
            openChat();
        }
    });

    closeButton.addEventListener("click", closeChat);

    addMessage(
        "Hi, I'm Manas AI. Ask me about Manas, his projects, skills or technologies.",
        "bot"
    );

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = input.value.trim();

        if (!message || sendButton.disabled) {
            return;
        }

        addMessage(message, "user");

        input.value = "";
        input.disabled = true;
        sendButton.disabled = true;

        const typing = addMessage("THINKING...", "bot typing");

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message,
                    previousInteractionId
                })
            });

            const data = await response.json();

            typing.remove();

            if (!response.ok || !data.reply) {
                console.error("AI API error:", data);

                throw new Error(
                    data.error || "Request failed"
                );
            }

            addMessage(data.reply, "bot");

            if (data.interactionId) {
                previousInteractionId = data.interactionId;
            }

        } catch (error) {
            console.error("Manas AI error:", error);

            addMessage(
                `AI ERROR: ${error.message}`,
                "bot"
            );

        } finally {
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    });
});