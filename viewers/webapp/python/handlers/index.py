import tornado
from tornado.web import RequestHandler
from ._mixins import RequestHandler

__all__ = ("Index",)


class Index(RequestHandler, tornado.auth.OAuth2Mixin):
    async def get(self):
        self.render("index_new.html", title="New Index Page")


# class Index(RequestHandler, tornado.auth.OAuth2Mixin):
#     def get(self):
#         self.render("index.html", title="NWM v1.2.2")

#     def post(self):
#         ulat = self.get_argument("ulat")
#         llat = self.get_argument("llat")
#         ulon = self.get_argument("ulon")
#         llon = self.get_argument("llon")
#         hucs = self.get_argument("hucs")

#         if "" in [ulat, ulon, llat, llon]:
#             self.render(
#                 "index.html",
#                 title="CUAHSI Subsetter v0.1",
#                 msg="ERROR: Missing required input",
#             )

#         # build GET url for subsetting
#         query = f"llat={llat}&llon={llon}&ulat={ulat}&ulon={ulon}&hucs={hucs}"
#         self.redirect("nwm/v1_2_2/subset?%s" % query)
