#!/usr/bin/env python3

import time


def print_worker(*args, **kwargs):
    
    # simulate a long running job
    time.sleep(30)

    name = 'worker2'

    return dict(name=name,
                args=args,
                kwargs=kwargs)
