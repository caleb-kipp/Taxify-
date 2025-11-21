# server.py — Flask example for webhooks (payments, verification)
# pip install flask
from flask import Flask, request, jsonify
app = Flask(__name__)

# Simple endpoint to receive payment notifications from a gateway
@app.route('/webhook/payment', methods=['POST'])
def payment_webhook():
    data = request.json or {}
    # validate signature in headers (omitted here)
    print('Payment webhook', data)
    # TODO: update ride/payment status
    return jsonify({'ok':True}), 200

@app.route('/health')
def health():
    return jsonify({'status':'ok'})

if __name__ == '__main__':
    app.run(port=5000, debug=True)