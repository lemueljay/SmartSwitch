from flask import Flask, request, redirect, render_template, url_for
from flask_login import LoginManager

import flask_login
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

from flask import jsonify

from flask_socketio import SocketIO, send, emit



app = Flask(__name__)
app.secret_key = 'supermario'
socketio = SocketIO(app)

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
    user.id = cuser
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
            print rows[0][1]
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

        print passhash

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
            print rows[0][1]
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
    emit('hub_status', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)



