#!/usr/bin/env python3

import sqlite3


# TODO: This should be defined globally somewhere instead of hardcoded
huc_dbpath = 'data/huc12_bbox.db'

def get_bbox_from_hucs(huclevel, huclist):
    
    # connect to the database path
    conn = sqlite3.connect(huc_dbpath, timeout=10)
    cursor = conn.cursor()
    
    hucids = tuple(huclist)
    query = "select * from bboxes where hucid in (%s)" % (','.join([str(h) for h in huclist]))
    cursor.execute(query)
    res = cursor.fetchall()

    for r in res:
        print(r)

    # TODO: calculate global bbox


if __name__ == '__main__':
    # quick sanity check
    get_bbox_from_hucs(12, ['120701010901',
                            '120701010902',
                            '120701010903',
                            '120701010904',
                            '120701010905',
                            '120701010906',
                            ])
