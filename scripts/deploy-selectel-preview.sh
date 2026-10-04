#!/usr/bin/env bash
# First installation of the reviewed static site on the owner's Selectel VM.
set -Eeuo pipefail
umask 022
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
readonly IP=87.228.105.192
readonly REV=138c05f21e26466202b0c8f3bc17444ab52918bc
readonly REPO=https://github.com/nesterovkolya1337-source/dve-korobki-site.git
readonly CONF=/etc/nginx/conf.d/dve-korobki-preview.conf
readonly CURRENT=/var/www/dve-korobki/current

[[ $EUID == 0 ]] || { echo 'Run in the Selectel root console.'; exit 1; }
ip -o -4 addr show | grep -Fq " $IP/" || { echo 'Wrong server IP; stopped.'; exit 1; }
[[ ! -e "$CONF" && ! -L "$CONF" && ! -e "$CURRENT" && ! -L "$CURRENT" ]] || {
  echo 'An installation already exists; stopped without overwriting it.'; exit 1;
}
if ss -H -ltn 'sport = :80' | grep -q .; then
  echo 'Port 80 is already in use; inspect its service before installation.'; exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates git nodejs npm nginx curl
node -e 'if(Number(process.versions.node.split(".")[0]) < 20) process.exit(1)'
nginx -t

install -d -m 755 /opt/dve-korobki /var/www/dve-korobki/releases
SOURCE=$(mktemp -d /opt/dve-korobki/source.XXXXXXXX)
git -C "$SOURCE" init -q
git -C "$SOURCE" remote add origin "$REPO"
git -C "$SOURCE" fetch --depth=1 origin "$REV"
git -C "$SOURCE" checkout -q --detach FETCH_HEAD
[[ $(git -C "$SOURCE" rev-parse HEAD) == "$REV" ]]
cd "$SOURCE"
node --input-type=module -e '
import fs from "node:fs";
const b=JSON.parse(fs.readFileSync("content/business.json", "utf8"));
if(b.leadForm?.enabled !== false || b.formEndpoint) throw Error("Preview must not collect leads");'
BASE_PATH='' SITE_URL="http://$IP" npm run check
RELEASE=$(mktemp -d "/var/www/dve-korobki/releases/${REV:0:12}.XXXXXXXX")
chmod 755 "$RELEASE"
cp -a dist/. "$RELEASE/"
printf '%s\n' "$REV" > "$RELEASE/deployed-revision.txt"

# Roll back only the two paths created below if configuration or smoke checks fail.
activated=0
rollback() {
  code=$?
  if (( code != 0 && activated == 1 )); then
    rm -f -- "$CONF" "$CURRENT"
    if nginx -t; then systemctl reload nginx || true; fi
    echo 'Preview activation rolled back. Source and release retained for inspection.' >&2
  fi
  exit "$code"
}
trap rollback EXIT
activated=1
ln -s "$RELEASE" "$CURRENT"
cat > "$CONF" <<'NGINX'
# Managed first-install IP preview; custom-domain launch requires separate setup.
server {
    listen 80;
    server_name 87.228.105.192;
    root /var/www/dve-korobki/current;
    index index.html;
    server_tokens off;
    access_log off;
    add_header X-Robots-Tag "noindex, nofollow" always;
    add_header X-Content-Type-Options nosniff always;
    location / { try_files $uri $uri/ =404; }
    error_page 404 /404.html;
    location = /404.html { internal; }
    location ~ /\. { deny all; }
}
NGINX
nginx -t
systemctl enable --now nginx
systemctl reload nginx
[[ $(curl --noproxy '*' -fsS --max-time 10 -H "Host: $IP" http://127.0.0.1/deployed-revision.txt) == "$REV" ]]
curl --noproxy '*' -fsS --max-time 10 -H "Host: $IP" http://127.0.0.1/ -o /dev/null
[[ $(curl --noproxy '*' -sS --max-time 10 -o /dev/null -w '%{http_code}' -H "Host: $IP" http://127.0.0.1/this-route-must-not-exist/) == 404 ]]
trap - EXIT
printf '\nREADY: http://%s/\nRevision: %s\nLocal HTTP checks passed. External access still needs verification.\n' "$IP" "$REV"
