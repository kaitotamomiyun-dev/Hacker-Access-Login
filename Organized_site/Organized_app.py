from flask import Flask, render_template

app = Flask(__name__)

from Organized_routes import *

if __name__=="__main__":
    app.run(debug=False, host="0.0.0.0", port=1000)