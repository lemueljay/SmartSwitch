from flask import Flask, request, redirect,render_template, url_for
from flask_login import LoginManager

import flask_login
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = 'supermario'

login_manager = LoginManager()


app.static_folder = 'static'
app.jinja_env



login_manager.init_app(app)
login_manager.login_view = 'login'

usern = "admin"
passw = "1234"

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(cuser):
    user = User()
    user.id = cuser
    return user



#ROUTER

@app.route('/login', methods=['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template('login.html')
		
	if request.method == 'POST':
		error = None
		username = request.form['username']
        password = request.form['password']

        con = sqlite3.connect("smart.sqlite")
        con.row_factory = sqlite3.Row

        cur = con.cursor()
        cur.execute("SELECT password FROM users WHERE username = ?",[username])

        rows = [row[0] for row in cur.fetchall()]
        cur.close()

        passhash = rows[0].encode('utf-8')

        print passhash

        if check_password_hash(passhash, password):
            user = User()
            user.id = username
            flask_login.login_user(user)
            return redirect(url_for('dash'))
	error = "MISMATCHED"
	return error


@app.route('/logout')
def logout():
    flask_login.logout_user()
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
			cur.execute('INSERT INTO users (username,password,firstname,lastname) VALUES (?,?,?,?)',(username,hash_pass,fname,lname))
			con.commit()

			user = User()
			user.id = username
			flask_login.login_user(user)

		return redirect(url_for('dash'))


@app.route('/')
@flask_login.login_required
def dash():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
