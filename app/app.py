#!/usr/bin/env python3


import falcon
import endpoints

# instantiate web application
api = falcon.API()

# define routes
api.add_route('/', endpoints.Index())
api.add_route('/SubsetWithBBox', endpoints.SubsetWithBbox())

