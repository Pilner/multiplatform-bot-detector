<h1 style="text-align: center">Multiplatform Malicious Bot Detector</h1>

<p style="text-align: center">Multiplatform Ensemble-Based Malicious Bot Detection
System Using Semi-Supervised Self-Training Approach
</p>

<h3 style="text-align: center">Backend Guide</h3>

## How to use

_Note: Make sure you have the latest [Python](https://www.python.org/downloads/) installed. To check, run `python --version` in your terminal_

1. Change directory (`cd`) to `server` folder

```bash
cd server
```

2. Start a virtual environment for your dependencies using `venv` or `virtualenv`

```bash
python -m venv .venv_server
```

3. Activate the virtual environment

```bash
# If on UNIX systems
source .venv_server/bin/activate

# If on Windows Systems
source .venv_server/Scripts/activate

# After running the command, you will now see (venv_server) in your terminal
```

4. Install the required packages

```bash
# Minified version of the requirements
pip install -r ./requirements_min.txt
```

5. After installing, start the backend server process. (<kbd>Ctrl</kbd>+<kbd>C</kbd> to exit process)

```bash
python app.py
```

6. See the web application with the frontend process on `http://localhost:3000`

7. In order to deactivate the virtual environment

```bash
deactivate
```
