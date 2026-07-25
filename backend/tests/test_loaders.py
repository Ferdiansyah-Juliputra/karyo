import pytest
from app.loaders.document_loader import load_document
from app.exceptions import ValidationError

def test_invalid_document_type():
    with pytest.raises(ValidationError):
        load_document(
            "dummy.xyz",
        )