
import sqlite3

class Connect(object):

    def connect(self):
        conn = sqlite3.connect('data/jobs.db', timeout=10)
        cursor = conn.cursor()
        return conn, cursor

    def build(self):
        conn, cursor = self.connect()
        try:
            cursor.execute('''CREATE TABLE jobs (guid text,
                              status text, url text, dt_start datetime,
                              dt_end datetime)''')
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
    
    def save_job(self, guid, status, text, start=None, end=None):
        conn, cursor = self.connect()
        cursor.execute("select * from jobs where guid = ?", (guid,))
        res = cursor.fetchall()
        if len(res) == 0:
            cursor.execute("insert into jobs (guid, status, url, dt_start, "
                           "dt_end) values (?, ?, ?, ?, ?)",
                           (guid, status, text, start, end))
        else:
            cursor.execute("update jobs "
                           "set status = ?, url = ?, dt_start = ?, dt_end = ? "
                           "where guid = ?", (status, text, start, end, guid))
        
        conn.commit()
        conn.close()

