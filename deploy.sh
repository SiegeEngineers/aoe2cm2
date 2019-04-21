#! /bin/bash

npm run build && npm run build-server && supervisorctl restart aoe2cm2
