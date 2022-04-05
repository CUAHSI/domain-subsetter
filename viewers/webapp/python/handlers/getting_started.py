from ._mixins import RequestHandler

__all__ = ("GettingStarted",)


class GettingStarted(RequestHandler):
    async def get(self):
        self.render("getting-started.html", title="Getting Started")
