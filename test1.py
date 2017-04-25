from schedule import * 
import schedule
import time

import sqlite3


def job():
	current_datetime = time.strftime("%Y-%m-%d") + ' ' + time.strftime("%H:%M:%S")
	print(current_datetime)
	print("I am working...")
	with sqlite3.connect("smart.sqlite") as con:
		cur = con.cursor()
		query = "SELECT * FROM Devices WHERE schedule_datetime <= '%s" % current_datetime + "'"
		cur.execute(query)
		result = cur.fetchall()
		cur.close()
		if result is not None:
			for res in result:
				cur = con.cursor()
				query = "UPDATE Devices SET schedule_datetime = null WHERE id = %s" % res[0] 
				cur.execute(query)
				con.commit()
				cur.close()
				
	
schedule.every(1).seconds.do(job)
	
while True:
	schedule.run_pending()
	time.sleep(1)