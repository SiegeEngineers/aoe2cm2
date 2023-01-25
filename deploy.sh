#! /bin/bash
set -e

npm run build-server

if [ $HOSTNAME = "maury.uberspace.de" ]
then
    cp -r build/images ~/cm/
    cp -r build/static ~/cm/
elif [ $HOSTNAME = "shoemaker.uberspace.de" ]
then
    cp -r build/images ~/html/
    cp -r build/static ~/html/
else
    echo "Unknown hostname. Skipping deployment of static files."
fi

supervisorctl restart aoe2cm2
