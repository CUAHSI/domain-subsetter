#!/usr/bin/env python3


import os
import json
#import socket
#import shutil
#import logging
import tornado.auth
import tornado.web

import bbox

from tornado.log import enable_pretty_logging
enable_pretty_logging()


class RequestHandler(tornado.web.RequestHandler):
    errors = []

    def get_or_error(self, argname, strip=True):
        """
        This function gets a REST input argument or returns an error message if the argument is not found
        Arguments:
        argname -- the name of the argument to get
        strip -- indicates if the whitespace will be stripped from the argument
        """
        arg = self.get_argument(argname, default=None, strip=strip)
        if arg is None:
            error = 'Could not find required parameter "%s"' % argname
            self.render("index.html", header=header, args=args, error=error)
        return arg

    def get_arg_value(self, argname, isrequired, strip=True):
        arg = self.get_argument(argname, default=None, strip=strip)
        if arg is None and isrequired:
            error = 'Could not find required parameter "%s"' % argname
            self.errors.append(error)
        return arg
   
    def check_for_errors(self):
        response = False
        if len(self.errors) > 0:
            response = dict(message="invalid arguments", status="fail")
        return response
            

class IndexHandler(RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):
        response = {
                    'message': (
                      "Index page of the NWM subsetting API."
                     ),
                    'author': 'Tony Castronova'
                   }
        self.response = response
        self.write(json.dumps(response))


class SubsetWithBbox(RequestHandler, tornado.auth.OAuth2Mixin):
    def get(self):

        # get arguments from the query string.
        # display an error if req args are missing.
        self.errors = []
        llat = self.get_arg_value('llat', True)
        llon = self.get_arg_value('llon', True)
        ulat = self.get_arg_value('ulat', True)
        ulon = self.get_arg_value('ulon', True)

        # return an error if args are invalid        
        response = self.check_for_errors()
        if response:
            self.response = response
            self.write(json.dumps(response))
            return

        

        print('begin subsetting', flush=True)
        result = bbox.subset_with_bbox(llat, llon, ulat, ulon)
        print(result)
        import pdb; pdb.set_trace()

        response = dict(message='subset complete')
        self.response = response
        self.write(json.dumps(response))
#
#        # make all usernames lowercase
#        username = husername.lower()
#        if resourcetype != "":
#            resourcetype = resourcetype.lower()
#
#        # build userspace
#        try:
#            msg = '%s -> building userspace' % husername
#            print(msg)
#            utilities.build_userspace(username)
#        except Exception as e:
#            print('ERROR %s: %s' % (msg, e))
#
#        print('HERE')
#        try:
#            msg = '%s -> writing .env' % husername
#            print(msg)
#            utilities.set_hydroshare_args(husername, resourceid, resourcetype)
#        except Exception as e:
#            print('ERROR %s: %s' % (msg, e), flush=True)
#
#        # generate the redirect url
#        baseurl = os.environ['JUPYTER_HUB_IP']
#        port = os.environ['JUPYTER_PORT']
#        
#        # build the redirect url 
#        if port == '443':
#            proto = 'https'
#            port = ''
#        else:
#            proto = 'http'
#            port = ':'+port
#        
#        if target is not None:
#            url = "%s://%s%s/user/%s/tree/%s" % (proto, baseurl, port, username, target)
#        else:
#            url = "%s://%s%s/user/%s/tree/notebooks/Welcome.ipynb" % (proto, baseurl, port, username)
#
#        print("URL:" + url)
#
#        # save the next url to ensure that the redirect will work
#        p = os.path.join(os.environ['HYDROSHARE_REDIRECT_COOKIE_PATH'], '.redirect_%s' % username)        
#        with open(p, 'w') as f:
#            f.write(url)
#
#        # redirect to the desired page
#        self.redirect(url, status=303)
