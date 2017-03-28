from flask import Flask, request, redirect,render_template, url_for
from flask_login import LoginManager
import flask_login
import sqlite3

app = Flask(__name__)
app.secret_key = 'supermario'

login_manager = LoginManager()

app.static_folder = 'static'
app.jinja_env



login_manager.init_app(app)


usern = "admin"
passw = "1234"

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(cuser):
    if cuser != usern: #query ni dapita i search sa db kung naa bay ga exist
        return

    user = User()
    user.id = cuser
    return user



@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        if request.form['password'] == passw and username == usern:
            user = User()
            user.id = username
            flask_login.login_user(user)
            return redirect(url_for('dash'))

        return 'Bad login'


@app.route('/loginsa')
def loginsa():
    return render_template('login.html')

@app.route('/logout')
def logout():
    flask_login.logout_user()
    return redirect(url_for('loginsa'))

@app.route('/signup',  methods=['POST'])
def signup():
    fname = request.form['newFname']
    lname = request.form['newLname']
    username = request.form['newusername']
    password = request.form['newpassword']
    repass = request.form['rnewpassword']

    if (repass != password):
        error = 'Password didnt Match'
    else:
        if request.method == 'POST':
            #TODOa
            return
    return render_template()



@app.route('/dashboard')
@flask_login.login_required
def dash():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
