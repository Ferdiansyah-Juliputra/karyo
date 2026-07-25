from backend.app.prompts.review import build_review_prompt
from backend.app.services.llm import generate_response
from backend.app.schemas.review import ResumeReview


def review_resume(
    resume: str,
    requirement: str,
) -> ResumeReview:

    prompt = build_review_prompt(
        resume=resume,
        requirement=requirement,
    )

    return generate_response(prompt)
