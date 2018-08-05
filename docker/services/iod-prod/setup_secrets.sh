
mkdir secrets/
echo "DO NOT USE IN PRODUCTION"
openssl req -nodes -x509 -newkey rsa:1024 -keyout secrets/key.pem -out secrets/cert.pem -days 3650
