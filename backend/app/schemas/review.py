from pydantic import BaseModel, Field


class ResumeReview(BaseModel):
    """Validated response contract for a resume review."""

    ats_score: int = Field(
        ge=0,
        le=100,
        description="Estimated ATS match score from 0 to 100.",
    )
    summary: str = Field(
        description="A concise, evidence-based summary of the candidate's fit.",
    )
    strengths: list[str] = Field(
        description="Resume-backed strengths relevant to the job requirement.",
    )
    missing_skills: list[str] = Field(
        description="Job requirements not demonstrated in the resume.",
    )
    recommendations: list[str] = Field(
        description="Specific, actionable improvements for the candidate's resume.",
    )
