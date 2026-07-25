def build_review_prompt(
    resume: str,
    requirement: str,
) -> str:
    return f"""You are an ATS reviewer and technical recruiter.
Compare the resume with the job requirement. Base every claim only on the
resume and requirement. Do not invent facts. Treat a requirement with no
supporting evidence in the resume as missing.

Job requirement:
{requirement}

Candidate resume:
{resume}
"""
