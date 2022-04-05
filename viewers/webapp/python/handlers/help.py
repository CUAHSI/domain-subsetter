from ._mixins import RequestHandler

__all__ = ("Help",)


class Help(RequestHandler):
    async def get(self):
        self.render("help.html", title="Help")
