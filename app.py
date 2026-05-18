# app.py
import sqlite3
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "super_secret_key_change_this"

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT UNIQUE, 
            password TEXT)''')
        conn.execute('''CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT, 
            category TEXT, 
            score INTEGER)''')
        conn.commit()

init_db()
tests_data = {
    "quantitative": [{"id": i, "q": f"Quantitative Q{i}: What is {10+i} + {5+i}?", "options": [str(15+2*i), str(20+i), str(10+i), "None"], "answer": str(15+2*i)} for i in range(1, 21)],
    "logical": [{"id": i, "q": f"Logical Reasoning Q{i}: If A=1, B=2, code for index {i}?", "options": [str(i), str(i+1), "A", "B"], "answer": str(i)} for i in range(1, 21)],
    "verbal": [{"id": i, "q": f"Verbal Ability Q{i}: Identify correct synonym for word context {i}.", "options": ["Option A", "Option B", "Option C", "Option D"], "answer": "Option A"} for i in range(1, 21)]
}

@app.route('/')
def home():
    if 'username' in session:
        return render_template('index.html', logged_in=True, username=session['username'])
    return render_template('index.html', logged_in=False)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_pw = generate_password_hash(data['password'])
    try:
        with get_db() as conn:
            conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (data['username'], hashed_pw))
            conn.commit()
        return jsonify({"success": True})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error": "Username taken"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE username = ?", (data['username'],)).fetchone()
    if user and check_password_hash(user['password'], data['password']):
        session['username'] = user['username']
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Invalid credentials"})

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

@app.route('/get_test/<category>', methods=['GET'])
def get_test(category):
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(tests_data.get(category, []))

@app.route('/submit_score', methods=['POST'])
def submit_score():
    if 'username' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.json
    with get_db() as conn:
        conn.execute("INSERT INTO scores (username, category, score) VALUES (?, ?, ?)", 
                     (session['username'], data['category'], data['score']))
        conn.commit()
    return jsonify({"success": True})

@app.route('/get_history', methods=['GET'])
def get_history():
    if 'username' not in session:
        return jsonify([])
    with get_db() as conn:
        rows = conn.execute("SELECT category, score FROM scores WHERE username = ? ORDER BY id DESC", (session['username'],)).fetchall()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    app.run(debug=True)
