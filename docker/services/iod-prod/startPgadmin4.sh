#!/bin/bash

docker run --name pgadmin4 --link iod-prod_db_1:postgres -p 5050:5050 -d fenglc/pgadmin4

echo "User: pgadmin4@pgadmin.org"
echo "Pass: admin"