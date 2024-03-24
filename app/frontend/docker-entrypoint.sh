#!/bin/sh
ROOT_DIR=/srv
# Replace env vars in files served by NGINX
for file in $ROOT_DIR/assets/*.js $ROOT_DIR/index.html;
do
    echo "Processing $file ...";
    # LC_ALL=C sed -i "" 's|VITE_APP_API_URL_PLACEHOLDER|'${VITE_APP_API_URL}'|g' $file
    sed -i 's|VITE_APP_API_URL_PLACEHOLDER|'${VITE_APP_API_URL}'|g' $file
    sed -i 's|VITE_APP_FULL_URL_PLACEHOLDER|'${VITE_APP_FULL_URL}'|g' $file
    sed -i 's|VITE_APP_BASE_PLACEHOLDER|'${VITE_APP_BASE}'|g' $file
    sed -i 's|VITE_GIS_SERVICES_URL_PLACEHOLDER|'${VITE_GIS_SERVICES_URL}'|g' $file
done

exec "$@"