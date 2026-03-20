const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generate", async (req, res) => {
  try {
    const { email } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `You are Dawn, Assistant Director of Test Administration.

Write a professional email reply to this message:

${email}

Keep it clear, helpful, and include next steps.

End with:

Best regards,
Dawn
Assistant Director of Test Administration`
      })
    });

    const data = await response.json();

    const reply = data.output?.[0]?.content?.[0]?.text || "Error generating response";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Dawn Email Assistant is running");
});

app.listen(3000, () => {
  console.log("Server running");
});
