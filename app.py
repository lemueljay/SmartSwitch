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
    #if cuser != usern: #query ni dapita i search sa db kung naa bay ga exist
    #    return

    user = User()
    user.id = cuser
    return user



@app.route('/auth', methods=['GET', 'POST'])
def auth():
    error = None

    if request.method == 'POST':
        username = request.form['username']

        if request.form['password'] == passw and username == usern:
            user = User()
            user.id = username
            flask_login.login_user(user)
            return redirect(url_for('dash'))
    error = 'MISMATCHED'
    return error

@app.route('/createAcc', methods=['POST'])
def createAcc():
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


#router

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('login'))

@app.route('/sign-up')
def signup():
    return render_template('sign-up.html')


@app.route('/')
@flask_login.login_required
def dash():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
