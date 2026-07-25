import time
import requests

from app.config.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    OPENROUTER_MODEL,
)
from app.exceptions import OpenRouterError
from app.logger.logger import logger


def generate(prompt: str) -> str:
    logger.info(f"Using OpenRouter model '{OPENROUTER_MODEL}'")

    start = time.perf_counter()

    try:
        response = requests.post(
            f"{OPENROUTER_BASE_URL}",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
            },
            timeout=30,
        )

        response.raise_for_status()

        elapsed = (time.perf_counter() - start) * 1000

        logger.info(
            "OpenRouter responded with %s in %.2f ms",
            response.status_code,
            elapsed,
        )

        return response.json()["choices"][0]["message"]["content"]

    except requests.RequestException as e:
        logger.exception("Failed to communicate with OpenRouter")
        raise OpenRouterError(str(e))