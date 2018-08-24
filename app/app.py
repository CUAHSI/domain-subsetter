#!/usr/bin/env python3


import falcon

class QuoteResource:
    def on_get(self, req, resp):
        """Handles GET requests"""
        quote = {
            'quote': (
                "I've always been more interested in "
                "the future than in the past."
            ),
            'author': 'Grace Hopper'
        }

        resp.media = quote

class Index:
    def on_get(self, req, resp):
        """Handles GET requests"""
        response = {
            'message': (
                "Index page of the NWM subsetting API."
            ),
            'author': 'Tony Castronova'
        }

        resp.media = response


api = falcon.API()
api.add_route('/quote', QuoteResource())
api.add_route('/', Index())

