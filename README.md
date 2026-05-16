# Aptitude Test Website

This is a full-stack web application for taking aptitude tests. Users can create an account, log in, take tests in different categories, and view their past scores.

The project uses HTML, CSS, and JavaScript for the frontend, and Python with Flask and SQLite for the backend.

---

## Features

- User Accounts: Users can register and log in securely.
- Three Test Categories: There are 20-mark tests for Quantitative Aptitude, Logical Reasoning, and Verbal Ability.
- Interactive Quiz Engine: Users can select answers and move back and forth between questions.
- Instant Results: The website calculates the score immediately after the test is submitted.
- Score History: Past test scores are saved in a database and displayed on the user dashboard.

---

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (Fetch API)
- Backend: Python 3, Flask Framework
- Database: SQLite3
- Session Management: Flask-Session

---

## Project Structure

```text
aptitude_project/
│── app.py            # Main Python script for server logic and database
│── database.db       # SQLite database file (created automatically)
│── .gitignore        # Tells Git which files to ignore
│── README.md         # Project documentation
│── static/
│   ├── style.css     # CSS file for website styling
│   └── script.js     # JavaScript file for test logic and API requests
└── templates/
    └── index.html    # HTML file for the website layout
```

---

## How to Set Up and Run Locally

Follow these steps to run the project on your computer:

### 1. Check Python installation
Make sure Python is installed on your computer. You can check it by running this command in your terminal:
```bash
python --version
```

### 2. Install Flask
Open your terminal in VS Code and run the following command to install the required framework:
```bash
pip install flask
```

### 3. Run the application
Start the Python server by running:
```bash
python app.py
```

### 4. Open the website
Open your web browser and go to this address:
http://127.0.0.1:5000

---

## How to Use the Website

1. Click the registration link on the login screen to create a new account.
2. Log in with your new username and password to open the dashboard.
3. Select any of the three available aptitude tests to begin.
4. Answer the questions using the Next and Previous buttons.
5. Click Submit at the end to see your score and save it to your history.
