import json
import re
import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

REVIEW_PROMPT = """You are an expert code reviewer. Analyze the following {language} code and return ONLY a valid JSON object (no markdown, no explanation, no code blocks).

Code to review:
```{language}
{code}
```

Return this exact JSON structure:
{{
  "score": <integer 1-10>,
  "bugs": [
    {{"title": "Bug name", "description": "What the bug is", "line": "approximate line or null", "severity": "high|medium|low"}}
  ],
  "vulnerabilities": [
    {{"title": "Vulnerability name", "description": "Security issue details", "severity": "critical|high|medium|low"}}
  ],
  "performance_issues": [
    {{"title": "Issue name", "description": "Performance problem details", "impact": "high|medium|low"}}
  ],
  "code_smells": [
    {{"title": "Smell name", "description": "Code quality issue"}}
  ],
  "suggestions": [
    {{"title": "Suggestion title", "description": "How to improve", "priority": "high|medium|low"}}
  ],
  "readability": {{
    "score": <integer 1-10>,
    "comments": "Brief readability analysis"
  }},
  "fixed_code": "The complete improved/fixed version of the code",
  "summary": "A comprehensive 3-4 sentence overall review summary"
}}

Scoring guide:
1-3: Very poor (many bugs, security issues)
4-5: Below average (several issues)
6-7: Average (some issues, room for improvement)
8-9: Good (minor issues)
10: Excellent (production ready)

Be specific and actionable. Return ONLY the JSON, nothing else."""


def parse_gemini_response(text: str) -> dict:
    """Robustly parse JSON from Gemini response."""
    # Strip markdown code blocks if present
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON object
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

    # Return safe default if parsing fails
    return {
        "score": 5,
        "bugs": [],
        "vulnerabilities": [],
        "performance_issues": [],
        "code_smells": [],
        "suggestions": [{"title": "Review incomplete", "description": "Could not parse AI response. Please try again.", "priority": "high"}],
        "readability": {"score": 5, "comments": "Analysis unavailable"},
        "fixed_code": "",
        "summary": "The AI analysis could not be parsed. Please resubmit your code."
    }


async def review_code(language: str, code: str) -> dict:
    """Send code to Gemini and return structured review."""
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = REVIEW_PROMPT.format(
        language=language,
        code=code
    )

    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.2,
            max_output_tokens=8192,
        )
    )

    raw_text = response.text
    return parse_gemini_response(raw_text)
