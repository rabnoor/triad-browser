rm -rf /var/www/triad-browser/*
cp -r dist/. /var/www/triad-browser
systemctl reload nginx
echo "deploy complete"
