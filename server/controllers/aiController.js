import Groq from 'groq-sdk';

export const analyzeComplaint = async (req, res) => {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const { title, description, category } = req.body;

    const prompt = `
Analyze the complaint and return JSON only.

Complaint Title: ${title}
Description: ${description}
Category: ${category}

Return this exact JSON format:
{
  "priority": "Low/Medium/High",
  "department": "Suggested department",
  "summary": "Short summary",
  "response": "Formal response to user"
}
`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const text = completion.choices[0].message.content;

    // Extract JSON from response
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error('Invalid AI response format');
    }

    const result = JSON.parse(match[0]);

    res.json(result);
  } catch (error) {
    console.error('Groq Error:', error.message);

    res.status(500).json({
      message: 'AI analysis failed',
      error: error.message
    });
  }
};