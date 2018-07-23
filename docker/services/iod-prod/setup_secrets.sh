
mkdir secrets/
echo "DO NOT USE IN PRODUCTION"
openssl req -nodes -x509 -newkey rsa:4096 -keyout secrets/key.pem -out secrets/cert.pem -days 365