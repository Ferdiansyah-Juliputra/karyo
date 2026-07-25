from pathlib import Path

from backend.app.exceptions import ValidationError
from backend.app.loaders.pdf_loader import load_pdf
from backend.app.loaders.docx_loader import load_docx
from backend.app.loaders.text_loader import load_text

LOADERS = {
    "pdf": load_pdf,
    "docx": load_docx,
    "txt": load_text,
}


def load_document(source: str) -> str:
    extension = Path(source).suffix.lower().lstrip(".")

    loader = LOADERS.get(extension)

    if loader is None:
        raise ValidationError(
            f"Unsupported file type: {extension}"
        )

    documents = loader(source)

    return "\n".join(
        doc.page_content
        for doc in documents
    )