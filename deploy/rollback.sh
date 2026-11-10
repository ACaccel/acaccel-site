#!/usr/bin/env bash
# Point the live site at the release before the current one. The ingress serves the link as is.
set -Eeuo pipefail

if [[ $EUID -ne 0 ]]; then
  exec sudo bash "$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)/rollback.sh"
fi
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
web_root=/var/www/acaccel-site

exec 9>/run/lock/acaccel-site-deploy.lock
flock -n 9 || { echo 'An acaccel-site deployment is running.' >&2; exit 1; }

current=$(readlink "$web_root/current")
previous=$(find "$web_root/releases" -mindepth 1 -maxdepth 1 -type d -regextype posix-extended \
  -regex '.*/[0-9]{8}T[0-9]{6}Z-[0-9a-f]{12,40}(-dirty)?' -printf '%f\n' \
  | sort | grep -B1 -Fx "${current#releases/}" | head -n -1 || true)
if [[ -z $previous ]]; then
  echo "No release older than $current is available." >&2
  exit 1
fi
ln -sfn "releases/$previous" "$web_root/current.new"
mv -Tf "$web_root/current.new" "$web_root/current"
echo "Rolled back from ${current#releases/} to $previous."
