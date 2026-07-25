from app.prompts.review import build_review_prompt
from app.services.llm import generate_response
from app.schemas.review import ResumeReview


def review_resume(
    resume: str,
    requirement: str,
) -> ResumeReview:

    prompt = build_review_prompt(
        resume=resume,
        requirement=requirement,
    )

    return generate_response(prompt)
