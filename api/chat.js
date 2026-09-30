export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message, history = [] } = req.body || {};

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" });
        }

        const contents = [];

        for (const item of Array.isArray(history) ? history.slice(-10) : []) {
            if (!item || !item.role || !item.text) continue;

            contents.push({
                role: item.role === "assistant" ? "model" : "user",
                parts: [{ text: String(item.text).slice(0, 4000) }]
            });
        }

        contents.push({
            role: "user",
            parts: [{ text: message.slice(0, 4000) }]
        });

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{
                            text: `You are "Manas AI", the AI assistant on Manas Sinha's developer portfolio.

Your job is to answer questions about Manas, his portfolio, projects, technologies, education and publicly displayed contact information.

Known portfolio information:
- Name: Manas Sinha
- Role: Aspiring Full Stack Developer
- Education: BTech CSE student
- Technologies shown on the portfolio: Java, Spring Boot, Thymeleaf, JavaScript, HTML, CSS, MySQL, JPA/Hibernate and React.
- Projects:
  1. Dragon Realm — gaming-inspired web application with a cinematic interface and interactive UI. Technologies: HTML, CSS, JavaScript, Spring Boot, Thymeleaf.
  2. Employee & User Management — web application for managing employee and user information with database integration. Technologies: Java, Spring Boot, Thymeleaf, JPA, MySQL.
  3. Hospital Management — Java web application for managing hospital information, doctors and patients. Technologies: Java, Maven, JSP, Servlets, MySQL.
  4. California Watches — modern e-commerce web application for a premium watch brand with shopping and user functionality. Technologies: Java, Spring Boot, Thymeleaf and MySQL.
- GitHub: https://github.com/manas-sinha07
- LinkedIn: https://www.linkedin.com/in/manas-sinha-a86288427/

Rules:
- Be concise, friendly and professional.
- Answer portfolio-related questions directly.
- Do not invent achievements, experience, projects, qualifications, links or facts that are not provided here.
- If something is not known from the portfolio information, say that you don't have that information.
- You are an assistant for the portfolio, not Manas himself.`
                        }]
                    },
                    contents,
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 500
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);
            return res.status(502).json({
                error: "Gemini request failed."
            });
        }

        const text = data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!text) {
            return res.status(502).json({
                error: "Gemini returned an empty response."
            });
        }

        return res.status(200).json({ reply: text });

    } catch (error) {
        console.error("Chat API error:", error);

        return res.status(500).json({
            error: "Something went wrong while contacting the AI."
        });
    }
}
