#!/usr/bin/env python3

# dependencies
# - pyshp, sqlite3

import sys
import sqlite3
import shapefile as shp


class HucData(object):

    def __init__(self, dbname):
        self.dbname = dbname

    def connect(self):
        conn = sqlite3.connect(self.dbname, timeout=10)
        cursor = conn.cursor()
        return conn, cursor

    def build(self):
        conn, cursor = self.connect()
        try:
            cursor.execute('''CREATE TABLE bboxes (hucid text,
                              huclevel text,
                              llon number, llat number,
                              ulon number, ulat number)''')
        except sqlite3.OperationalError:
            pass

    def insert_many(self, datalist):
        conn, cursor = self.connect()

        conn.executemany('''insert into bboxes(hucid,huclevel,llon,llat,ulon,ulat)
                        values (?,?,?,?,?,?)''', data)

        conn.commit()
        conn.close()


if __name__ == '__main__':

#    path = 'spatial_data/huc12-wgs84/HUC12_US.shp'
    path = 'spatial_data/huc12-lcc/HUC12_NWMproject.shp'
    huc_field_name = 'HUC12'
    dbname = 'huc12_bbox.db'

    sf = shp.Reader(path)
    if sf.shapeTypeName != 'POLYGON':
        print('[ERROR] input shapefile must contain polygon features')
        sys.exit(-1)

    print('--> locating hucid field...', flush=True, end='')
    idx = 0
    for field in sf.fields[1:]:
        if field[0] == huc_field_name:
            break
        idx += 1
    if idx == len(sf.fields):
        print('[ERROR] could not find field "%s"' % huc_field_name)
        sys.exit(-1)
    print('done')

    print('--> reading shape data...')
    data = []
    i = 0
    for feat in sf.iterShapeRecords():
        import pdb; pdb.set_trace()
        hucid = feat.record[idx]
        huclevel = len(hucid)
        llon, llat, ulon, ulat = feat.shape.bbox

        # save these to insert later
        data.append((hucid, huclevel, llon, llat, ulon, ulat))
        i += 1
        if i % 10000 == 0:
            print('---> read %d records' % i)

    print('--> inserting records into database... ', flush=True, end='')
    db = HucData(dbname)
    db.connect()
    db.build()
    db.insert_many(data)
    print('done')

    



