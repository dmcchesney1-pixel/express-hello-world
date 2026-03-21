const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/generate", async (req, res) => {
  const { email } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Reply professionally as Dawn to this email:\n\n${email}`
      })
    });

    const data = await response.json();

    // 🔴 THIS LINE MAKES IT FAIL-SAFE
    const reply = data.output_text || JSON.stringify(data);

    res.json({ reply });

  } catch (err) {
    res.json({
      reply: "ERROR: Server could not reach OpenAI."
    });
  }
});

app.get("/", (req, res) => {
  res.send("Dawn Email Assistant is running");
});

app.listen(3000, () => console.log("Server running"));
