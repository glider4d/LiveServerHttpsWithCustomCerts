#example

CANAME=RootCA_fuck_society

openssl genrsa -aes256 -out $CANAME.key 4096
openssl req -x509 -new -nodes -key $CANAME.key -sha256 -days 1826 -out $CANAME.crt -subj '/CN=MyOrg Root CA/C=AT/ST=Vienna/L=Vienna/O=MyOrg'


openssl x509 -req -days 398 -in localhost.csr -CA RootCA_fuck_society.crt -CAkey RootCA_fuck_society.key -CAcreateserial -out localhost_cert.pem -extensions req_ext -extfile localhost.cnf


openssl req -sha256 -nodes -newkey rsa:2048 -keyout localhost_key.pem -out localhost.csr -config localhost.cnf

openssl x509 -req -days 398 -in localhost.csr -CA RootCA_fuck_society.crt -CAkey RootCA_fuck_society.key -CAcreateserial -out localhost_cert.pem -extensions req_ext -extfile localhost.cnf



#explanation with examples

1. create a private key
openssl genrsa -aes256 -out localhost.key 2048
2. create the certificate
openssl req -days 3650 -new -newkey rsa:2048 -key localhost.key -x509 -out localhost.pem



Prepare config files for creating certificates non-interactivelly (without prompts)
CA.cnf →

[ req ]
prompt = no
distinguished_name = req_distinguished_name

[ req_distinguished_name ]
C = US
ST = Localzone     
L = localhost    
O = Certificate Authority Local Center
OU = Develop      
CN = develop.localhost.localdomain
emailAddress = root@localhost.localdomain



######################################
localhost.cnf →

[req]
default_bits  = 2048
distinguished_name = req_distinguished_name
req_extensions = req_ext
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
countryName = US
stateOrProvinceName = Localzone
localityName = Localhost
organizationName = Certificate signed by my CA
commonName = localhost.localdomain

[req_ext]
subjectAltName = @alt_names

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = 127.0.0.1
IP.2 = 127.0.0.2
IP.3 = 127.0.0.3
IP.4 = 192.168.0.1
IP.5 = 192.168.0.2
IP.6 = 192.168.0.3
DNS.1 = localhost
DNS.2 = localhost.localdomain
DNS.3 = dev.local

Generate a CA private key and Certificate (valid for 5 years)
openssl req -nodes -new -x509 -keyout CA_key.pem -out CA_cert.pem -days 1825 -config CA.cnf
Generate web server secret key and CSR

openssl req -sha256 -nodes -newkey rsa:2048 -keyout localhost_key.pem -out localhost.csr -config localhost.cnf
Create certificate and sign it by own certificate authority (valid 1 year)
openssl x509 -req -days 398 -in localhost.csr -CA CA_cert.pem -CAkey CA_key.pem -CAcreateserial -out localhost_cert.pem -extensions req_ext -extfile localhost.cnf
Profit
Output files will be:

CA.cnf → OpenSSL CA config file. May be deleted after certificate creation process.
CA_cert.pem → [Certificate Authority] certificate. This certificate must be added to the browser local authority storage to make trust all certificates that created with using this CA.
CA_cert.srl → Random serial number. May be deleted after certificate creation process.
CA_key.pem → Must be used when creating new [localhost] certificate. May be deleted after certificate creation process (if you do not plan reuse it and CA_cert.pem).
localhost.cnf → OpenSSL SSL certificate config file. May be deleted after certificate creation process.
localhost.csr → Certificate Signing Request. May be deleted after certificate creation process.
localhost_cert.pem → SSL certificate. Must be installed at WEB server.
localhost_key.pem → Secret key. Must be installed at WEB server.
SSL Certificate alternative names can be checked by

openssl x509 -noout -text -in localhost_cert.pem | grep 'X509v3 Subject Alternative Name' -A 1
