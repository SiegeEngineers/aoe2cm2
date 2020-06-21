#! /bin/bash

npm run build && cp -r build/images ~/html/ && cp -r build/static ~/html/ && supervisorctl restart aoe2cm2
