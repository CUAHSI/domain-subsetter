from ._mixins import RequestHandler

__all__ = ("Api",)


class Api(RequestHandler):
    async def get(self):
        self.render("api.html", title="API Documentation")
