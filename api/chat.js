export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }


    try {

        const {
            message,
            history = []
        } = req.body || {};


        if (!message || typeof message !== "string") {

            return res.status(400).json({
                error: "Message is required"
            });

        }


        /*
         * Build Gemini conversation history.
         *
         * The current message is NOT included in history.
         * It is added separately below.
         */

        const contents = [];


        if (Array.isArray(history)) {

            for (const item of history.slice(-10)) {

                if (
                    !item ||
                    !item.role ||
                    !item.text
                ) {
                    continue;
                }


                contents.push({
                    role:
                        item.role === "assistant"
                            ? "model"
                            : "user",

                    parts: [
                        {
                            text: String(item.text).slice(0, 4000)
                        }
                    ]
                });

            }

        }


        /*
         * Add the current user message ONCE.
         */

        contents.push({
            role: "user",
            parts: [
                {
                    text: message.slice(0, 4000)
                }
            ]
        });


        /*
         * Send request to Gemini.
         */

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },

                body: JSON.stringify({

                    systemInstruction: {

                        parts: [
                            {
                                text: `
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
                                `
                            }
                        ]

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


        /*
         * IMPORTANT:
         * Return Gemini's REAL error instead of hiding it.
         */

        if (!response.ok) {

            console.error(
                "Gemini API error:",
                data
            );


            return res.status(response.status).json({

                error:
                    data?.error?.message ||
                    "Gemini request failed.",

                status: response.status

            });

        }


        const text =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("")
                .trim();


        if (!text) {

            console.error(
                "Gemini returned no text:",
                data
            );


            return res.status(502).json({
                error: "Gemini returned an empty response."
            });

        }


        return res.status(200).json({
            reply: text
        });


    } catch (error) {

        console.error(
            "Chat API error:",
            error
        );


        return res.status(500).json({

            error:
                error?.message ||
                "Something went wrong while contacting the AI."

        });

    }

}