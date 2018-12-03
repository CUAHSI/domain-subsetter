
import sqlite3

class Connect(object):
#    def __init__(self):
#        self.conn = sqlite3.connect('data/jobs.db')
#        self.c = self.conn.cursor()

    def connect(self):
        conn = sqlite3.connect('data/jobs.db', timeout=10)
        cursor = conn.cursor()
        return conn, cursor

    def build(self):
        conn, cursor = self.connect()
        try:
            cursor.execute('''CREATE TABLE jobs (guid text, status text, url text)''')
        except sqlite3.OperationalError:
            pass
    
    def get_jobs(self):
        conn, cursor = self.connect()
        cursor.execute("select * from jobs")
        res = cursor.fetchall()
        results = []
        for i in res:
            results.append(i)
        conn.close()
        return results

    def get_job_by_guid(self, guid):
        conn, cursor = self.connect()
        cursor.execute("select * from jobs where guid  = ?", (guid,))
        res = cursor.fetchall()
        conn.close()
        return res
    
    def save_job(self, guid, status, text):
        conn, cursor = self.connect()
        cursor.execute("select * from jobs where guid = ?", (guid,))
        res = cursor.fetchall()
        if len(res) == 0:
            cursor.execute("insert into jobs (guid, status, url) "
                           "values (?, ?, ?)", (guid, status, text))
        else:
            cursor.execute("update jobs "
                           "set status = ?, url = ? "
                           "where guid = ?", (status, text, guid))
        
        conn.commit()
        conn.close()

