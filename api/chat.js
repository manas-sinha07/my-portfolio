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
- If the requested information is not available in the portfolio information, say that it is not available.
- You are an AI assistant for the portfolio, not Manas himself.
`;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: "GEMINI_API_KEY is not configured."
        });
    }

    const { message, previousInteractionId } = req.body || {};

    if (!message || typeof message !== "string") {
        return res.status(400).json({
            error: "Message is required."
        });
    }

    try {
        const body = {
            model: "gemini-3.8-flash",
            input: message,
            system_instruction: SYSTEM_PROMPT,
            store: true
        };

        if (previousInteractionId) {
            body.previous_interaction_id = previousInteractionId;
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(response.status).json({
                error:
                    data?.error?.message ||
                    data?.message ||
                    "Gemini request failed.",
                status: response.status
            });
        }

        if (data.status === "failed") {
            return res.status(500).json({
                error:
                    data?.errors?.[0]?.message ||
                    "Gemini interaction failed."
            });
        }

        let reply = data.output_text;

        if (!reply && Array.isArray(data.steps)) {
            for (const step of data.steps) {
                if (step.type === "model_output" && Array.isArray(step.content)) {
                    const textParts = step.content
                        .filter(part => part.type === "text")
                        .map(part => part.text);

                    if (textParts.length > 0) {
                        reply = textParts.join("");
                        break;
                    }
                }
            }
        }

        if (!reply) {
            return res.status(500).json({
                error: "Gemini returned no text response."
            });
        }

        return res.status(200).json({
            reply,
            interactionId: data.id
        });

    } catch (error) {
        console.error("Server error:", error);

        return res.status(500).json({
            error: error.message || "Internal server error."
        });
    }
}