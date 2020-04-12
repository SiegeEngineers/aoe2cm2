#! /bin/bash

npm run build && npm run build-server && cp -r build/images ~/html/ && cp -r build/static ~/html/ && supervisorctl restart aoe2cm2
