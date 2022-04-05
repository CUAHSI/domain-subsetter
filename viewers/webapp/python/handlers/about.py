from ._mixins import RequestHandler

__all__ = ("About",)


class About(RequestHandler):
    async def get(self):
        self.render("about.html", title="About")
