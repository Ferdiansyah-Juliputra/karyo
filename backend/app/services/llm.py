from langchain_openai import ChatOpenAI

from app.config.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    OPENROUTER_MODEL,
)
from app.schemas.review import ResumeReview


def generate_response(prompt: str) -> ResumeReview:
    """Generate a validated resume-review object through OpenRouter."""
    api_base_url = OPENROUTER_BASE_URL.removesuffix("/chat/completions")

    model = ChatOpenAI(
        model=OPENROUTER_MODEL,
        api_key=OPENROUTER_API_KEY,
        base_url=api_base_url,
        temperature=0,
    )
    structured_model = model.with_structured_output(
        ResumeReview,
        method="json_schema",
    )

    return structured_model.invoke(prompt)
