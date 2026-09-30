document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("ai-chat-button");
    const panel = document.getElementById("ai-chat-panel");
    const closeButton = document.getElementById("ai-chat-close");
    const form = document.getElementById("ai-chat-form");
    const input = document.getElementById("ai-chat-input");
    const messages = document.getElementById("ai-chat-messages");
    const sendButton = document.getElementById("ai-chat-send");

    if (!button || !panel || !form || !input || !messages) return;

    const history = [];

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
        setTimeout(() => input.focus(), 100);
    }

    function closeChat() {
        panel.classList.remove("open");
        panel.setAttribute("aria-hidden", "true");
    }

    button.addEventListener("click", () => {
        panel.classList.contains("open") ? closeChat() : openChat();
    });

    closeButton.addEventListener("click", closeChat);

    addMessage(
        "Hi, I'm Manas AI. Ask me about Manas, his projects, skills or technologies.",
        "bot"
    );

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = input.value.trim();

        if (!message || sendButton.disabled) return;

        addMessage(message, "user");
        history.push({ role: "user", text: message });

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
                    history: history.slice(-10)
                })
            });

            const data = await response.json();

            typing.remove();

            if (!response.ok || !data.reply) {
                throw new Error(data.error || "Request failed");
            }

            addMessage(data.reply, "bot");
            history.push({ role: "assistant", text: data.reply });

        } catch (error) {
            console.error(error);
            addMessage(
                "Sorry, I couldn't connect to the AI right now. Please try again.",
                "bot"
            );
        } finally {
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    });
});
