const SYSTEM_PROMPT = `
You are "Manas AI", the AI assistant on Manas Sinha's developer portfolio.

Your job is to answer questions about Manas, his portfolio, projects, technologies, education and publicly displayed contact information.

Known portfolio information:

Name:
Manas Sinha

Role:
Aspiring Full Stack Developer

Education:
BTech Computer Science and Engineering (CSE) student.

Technologies:
- Java
- Spring Boot
- JPA / Hibernate
- MySQL
- JavaScript
- React
- Thymeleaf
- HTML
- CSS
- JSP
- Servlets
- Maven

Projects:

1. California Watches
A modern e-commerce web application for a premium watch brand with shopping and user functionality.
Technologies:
Java, Spring Boot, Thymeleaf, MySQL.

2. Dragon Realm
A gaming-inspired web application with a cinematic interface and interactive UI.
Technologies:
HTML, CSS, JavaScript, Spring Boot, Thymeleaf.

3. Employee & User Management
A web application for managing employee and user information with database integration.
Technologies:
Java, Spring Boot, Thymeleaf, JPA, MySQL.

4. Hospital Management
A Java web application for managing hospital information, doctors and patients.
Technologies:
Java, Maven, JSP, Servlets, MySQL.

GitHub:
https://github.com/manas-sinha07

LinkedIn:
https://www.linkedin.com/in/manas-sinha-a86288427/

Rules:
- Answer questions about Manas and his portfolio directly.
- Treat uppercase and lowercase questions the same.
- Be concise, friendly and professional.
- Do not invent achievements, qualifications, experience, projects or technologies.
- If the requested information is not available, say that it is not available in the portfolio information.
- You are an AI assistant for the portfolio, not Manas himself.
`;

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "OPENROUTER_API_KEY is not configured."
        });
    }

    const {
        message,
        history = []
    } = req.body || {};

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            error: "Message is required."
        });
    }

    try {

        const messages = [
            {
                role: "system",
                content: SYSTEM_PROMPT
            }
        ];

        /*
         * Add previous conversation messages.
         * Only allow the roles we actually need.
         */
        if (Array.isArray(history)) {

            for (const item of history.slice(-10)) {

                if (
                    item &&
                    (item.role === "user" || item.role === "assistant") &&
                    typeof item.text === "string"
                ) {
                    messages.push({
                        role: item.role,
                        content: item.text
                    });
                }
            }
        }

        /*
         * Add the current user message.
         */
        messages.push({
            role: "user",
            content: message
        });

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://my-portfolio-mu-ruddy-52.vercel.app",
                    "X-Title": "Manas Sinha Portfolio AI"
                },

                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: messages,
                    temperature: 0.4,
                    max_tokens: 500
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            console.error(
                "OpenRouter API error:",
                data
            );

            return res.status(response.status).json({
                error:
                    data?.error?.message ||
                    "OpenRouter request failed.",
                status: response.status
            });
        }

        const reply =
            data?.choices?.[0]?.message?.content;

        if (!reply) {

            console.error(
                "OpenRouter returned no text:",
                data
            );

            return res.status(500).json({
                error: "OpenRouter returned no text response."
            });
        }

        return res.status(200).json({
            reply
        });

    } catch (error) {

        console.error(
            "Server error:",
            error
        );

        return res.status(500).json({
            error:
                error.message ||
                "Internal server error."
        });
    }
}