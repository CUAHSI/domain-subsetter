#!/usr/bin/env python3

import sqlite3


# TODO: This should be defined globally somewhere instead of hardcoded
huc_dbpath = 'data/huc12_bbox.db'

def get_bbox_from_hucs(huclevel, huclist):
    """
    Calculates the bounding box for the intersection of the input huclist
    """
    
    # connect to the database path
    conn = sqlite3.connect(huc_dbpath, timeout=10)
    cursor = conn.cursor()
    
    hucids = tuple(huclist)

    query = "select * from bboxes where hucid in (%s)" % \
             (','.join(['"{0}"'.format(h) for h in huclist]))
    print(query)
    cursor.execute(query)
    res = cursor.fetchall()
    
    bbox = [99999999,
            99999999,
            -99999999,
            -99999999]
    for r in res:
        xmin, ymin, xmax, ymax = r[2:]
        bbox[0] = xmin if xmin < bbox[0] else bbox[0]
        bbox[1] = ymin if ymin < bbox[1] else bbox[1]
        bbox[2] = xmax if xmax > bbox[2] else bbox[2]
        bbox[3] = ymax if ymax > bbox[3] else bbox[3]

    # TODO: calculate global bbox

    # return global bounding box
    return bbox


if __name__ == '__main__':
    # quick sanity check
    get_bbox_from_hucs(12, ['120701010901',
                            '120701010902',
                            '120701010903',
                            '120701010904',
                            '120701010905',
                            '120701010906',
                            ])
