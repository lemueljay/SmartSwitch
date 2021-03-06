from flask import Flask, request, redirect, render_template, url_for
from flask_login import LoginManager

import flask_login
from flask_login import LoginManager, login_user, current_user, login_required, logout_user

from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

from flask import jsonify

from flask_socketio import SocketIO, send, emit

from schedule import *
import schedule
import time
from threading import Thread




app = Flask(__name__)
app.secret_key = 'supermario'
socketio = SocketIO(app, async_mode='gevent', ping_timeout=30, logger=False, engineio_logger=False)


# Login manager.
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


app.static_folder = 'static'
app.jinja_env


cuser = []


class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(cuser):
    user = User()
    user.username = cuser
    con = sqlite3.connect("smart.sqlite")
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute("SELECT ROWID, * FROM users WHERE username = ?", [cuser])
    rows = [row for row in cur.fetchall()]
    cur.close()
    user.id = rows[0][0]
    user.fname = rows[0][3]
    user.lname = rows[0][4]
    return user




# ROUTER

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    passhash = None

    if request.method == 'GET':
        return render_template('login.html', error=error)

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        con = sqlite3.connect("smart.sqlite")
        con.row_factory = sqlite3.Row

        cur = con.cursor()
        cur.execute("SELECT ROWID, * FROM users WHERE username = ?", [username])

        try:
            rows = [row for row in cur.fetchall()]
            cur.close()
            cuser.append({'id': rows[0][0], 'username': rows[0][1], 'fname': rows[0][3], 'lname': rows[0][4]})
            passhash = rows[0][2]
        except Exception as e:
            error = "Username/password did not match."
            return render_template('login.html', error=error)

        if len(rows) == 0:
            error = "Username/password did not match."
            return render_template('login.html', error=error)



        passhash = passhash.encode('utf-8')


        if check_password_hash(passhash, password):
            user = User()
            user.id = username
            flask_login.login_user(user)
            return redirect(url_for('dash'))

    error = "Username/password did not match."
    return render_template('login.html', error=error)



@app.route('/logout')
def logout():
    flask_login.logout_user()
    del cuser[:]
    return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'GET':
        return render_template('sign-up.html')

    if request.method == 'POST':
        fname = request.form['firstname']
        lname = request.form['lastname']
        username = request.form['username']
        password = request.form['password']

        hash_pass = generate_password_hash(password, method='sha256')

        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO users (username,password,firstname,lastname) VALUES (?,?,?,?)', (username, hash_pass, fname, lname))
            con.commit()

            cur.execute("SELECT ROWID, * FROM users WHERE username = ?", [username])
            rows = [row for row in cur.fetchall()]
            cur.close()
            cuser.append({'id': rows[0][0], 'username': rows[0][1], 'fname': rows[0][3], 'lname': rows[0][4]})
            passhash = rows[0][2]

            user = User()
            user.id = username
            flask_login.login_user(user)

        return redirect(url_for('dash'))


@app.route('/')
@flask_login.login_required
def dash():
    user = cuser[0]

    with sqlite3.connect("smart.sqlite") as con:
        cur = con.cursor()
        query = 'SELECT * FROM Hubcodes WHERE user_id = "' + str(user['id']) + '"'
        cur.execute(query)
        result = cur.fetchone()
        if result is not None:
            user['has_hub'] = True
            user['hubcode'] = result[1]
        else:
            user['has_hub'] = False
            user['hubcode'] = None

    return render_template('index.html', user=user)

@app.route('/connecthub', methods=['GET', 'POST'])
def connecthub():
    if request.method == 'GET':
        return None
    if request.method == 'POST':
        userid = request.json['userid']
        hubcode = request.json['hubcode']

        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO Hubcodes (hubcode, user_id) VALUES (?,?)', (hubcode, userid))
            con.commit()
            cur.close()

        return jsonify(userid=userid, hubcode=hubcode)

@app.route('/disconnecthub', methods=['GET', 'POST'])
def disconnecthub():
    if request.method == 'GET':
        return None
    if request.method == 'POST':
        userid = request.json['userid']

        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            cur.execute('DELETE FROM Hubcodes WHERE user_id = "' + userid + '"')
            con.commit()
            cur.close()

        return 'Lemmeister'

@app.route('/devices', methods=['GET'])
def get_devices():
    if request.method == 'GET':
        devices = {}
        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            query = 'SELECT * FROM Hubcodes WHERE user_id = "' + str(current_user.id) + '"'
            cur.execute(query)
            result = cur.fetchone()
            if result is not None:
                hubcode = result[1]
                query = 'SELECT * FROM Devices WHERE hubcode = "' + str(hubcode) + '"'
                cur.execute(query)
                result = cur.fetchall()
                counter = 0;
                if result is not None:
                    for res in result:
                        devices[str(counter)] = {}
                        devices[str(counter)]['id'] = res[0]
                        devices[str(counter)]['hubcode'] = res[1]
                        devices[str(counter)]['date_added'] = res[2]
                        devices[str(counter)]['device_name'] = res[3]
                        devices[str(counter)]['device_room'] = res[4]
                        devices[str(counter)]['device_state'] = res[5]
                        devices[str(counter)]['schedule_datetime'] = res[6]
                        devices[str(counter)]['schedule_state'] = res[7]
                        counter = counter + 1
                else:
                    devices = None
            else:
                devices = None
            return render_template('devices.html', devices=devices)

@app.route('/switch', methods=['GET', 'POST'])
def switch():
    if request.method == 'POST':
        device_id = request.json['device_id']
        hubcode = request.json['hubcode']
        device_state = request.json['device_state']
        return 'Lemmeister'


@app.route('/schedule', methods=['GET', 'POST'])
def scheduler_datetime():
    if request.method == 'POST':
        data = {}
        schedule_datetime = request.json['schedule_datetime']
        device_id = request.json['device_id']
        schedule_status = request.json['schedule_status']
        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            query = "UPDATE Devices SET schedule_datetime = '%s" % schedule_datetime + "', schedule_state = '%s" % schedule_status + "' WHERE id = %s" % device_id
            cur.execute(query)
            con.commit()
            cur.close()
        return "Lemmeister"

@app.route('/unschedule', methods=['GET', 'POST'])
def unscheduler_datetime():
    if request.method == 'POST':
        device_id = request.json['device_id']
        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            query = "UPDATE Devices SET schedule_datetime = null WHERE id = %s" % device_id
            cur.execute(query)
            con.commit()
            cur.close()
        return "Lemmeister"

@app.route('/adddevice', methods=['GET', 'POST'])
def adddevice():
    if request.method == 'POST':
        hubcode = request.json['hubcode']
        device_name = request.json['device_name']
        device_room = request.json['device_room']
        with sqlite3.connect("smart.sqlite") as con:
            cur = con.cursor()
            cur.execute('INSERT INTO devices (hubcode,device_name,device_room) VALUES (?,?,?)',
                        (hubcode, device_name, device_room))
            con.commit()
            cur.close()
        device = {}
        device['hubcode'] = hubcode
        device['device_name'] = device_name
        device['device_room'] = device_room
        return "Lemmeister"

# SOCKETS


# Object that represents a socket connection



hublist = []
hubs = {}

@socketio.on('hub_connect')
def hub_connect(hubcode):
    hubs[request.sid] = hubcode
    hublist.append(hubcode)
    print(hubcode + ' is now online.')
    print(hublist)

    data = {}
    data['hubcode'] = hubcode
    data['online'] = True
    emit('device_toggleable', data, broadcast=True)
    emit('hub_status', data, broadcast=True)



@socketio.on('disconnect')
def on_disconnect():
    hubcode = hubs.get(request.sid)
    if hubcode is not None:
        hublist.remove(hubcode)
        del hubs[request.sid]
        print(hubcode + ' is now offline.')
        print(hublist)

        data = {}
        data['hubcode'] = hubcode
        data['online'] = False
        emit('device_toggleable', data, broadcast=True)
        emit('hub_status', data, broadcast=True)


@socketio.on('check_hub_status')
def status(hubcode):
    data = {}
    data['hubcode'] = hubcode
    data['online'] = False
    for hub in hublist:
        if hub == hubcode:
            data['online'] = True
            break
    print(data)
    emit('device_toggleable', data, broadcast=True)
    emit('hub_status', data, broadcast=True)


@socketio.on('server_event_listener')
def server_event_listener(data):
    emit('hub_event_listener', data, broadcast=True)


@socketio.on('node_data')
def node_data(data):
	print("DATA FROM NODES: " + data['temp'] + ', ' + data['hum'] + ', ' + str(data['state']))
	emit('sensor_status', data, broadcast=True)
	
def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)


def job():
    current_datetime = time.strftime("%Y-%m-%d") + ' ' + time.strftime("%H:%M:%S")
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
                data = {}
                data['device_id'] = res[0]
                data['device_state'] =res[7]
                data['hubcode'] = res[1]
                socketio.emit('hub_event_listener', data, broadcast=True)


if __name__ == '__main__':
    schedule.every(1).seconds.do(job)
    t = Thread(target=run_schedule)
    t.start()
    socketio.run(app)



