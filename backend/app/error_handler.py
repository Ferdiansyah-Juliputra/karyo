from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return jsonify({
            "success": False,
            "message": error.description,
        }), error.code

    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.exception("Unhandled application error")
        return jsonify({
            "success": False,
            "message": "An unexpected server error occurred.",
        }), 500
