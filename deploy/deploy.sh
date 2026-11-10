#!/usr/bin/env bash
# Build as the invoking user, then install the release and switch the current link as root.
# Routing and TLS are provided by the host's LCM ingress; this script only manages releases.
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
web_root=/var/www/acaccel-site
keep_releases=5
# <UTC time>-<commit>, with -dirty when the working tree had uncommitted changes.
release_pattern='[0-9]{8}T[0-9]{6}Z-[0-9a-f]{12,40}(-dirty)?'

if [[ $EUID -ne 0 ]]; then
  cd "$repo_dir"
  # Uncommitted changes are allowed, but the release name marks them so the live site is not
  # mistaken for a build of the commit alone.
  suffix=''
  if [[ -n $(git status --porcelain) ]]; then
    suffix='-dirty'
    echo 'Warning: deploying uncommitted changes; the release is marked -dirty.' >&2
  fi
  export PATH="$repo_dir/.conda/bin:$PATH"
  npm run check
  release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short=12 HEAD)$suffix"
  exec sudo bash "$repo_dir/deploy/deploy.sh" --install "$release"
fi

[[ ${1:-} == --install && ${2:-} =~ ^${release_pattern}$ ]] || {
  echo 'Run deploy/deploy.sh as the deployment user, not directly as root.' >&2
  exit 2
}
release=$2
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
for tool in rsync flock; do command -v "$tool" >/dev/null; done
test -f "$repo_dir/dist/index.html"
test -f "$repo_dir/dist/404.html"

exec 9>/run/lock/acaccel-site-deploy.lock
flock -n 9 || { echo 'Another acaccel-site deployment is running.' >&2; exit 1; }

install -d -m 0755 "$web_root" "$web_root/releases"
previous_release=$(readlink "$web_root/current" || true)
release_dir="$web_root/releases/$release"

# Best effort: run every step even if one fails, then report the failures.
rollback() {
  trap - ERR INT HUP TERM
  set +e
  local failed=()
  echo 'Deployment failed; restoring the previous state.' >&2
  if [[ -n $previous_release ]]; then
    ln -sfn "$previous_release" "$web_root/current.new" &&
      mv -Tf "$web_root/current.new" "$web_root/current" || failed+=('release symlink')
  else
    rm -f -- "$web_root/current" || failed+=('release symlink')
  fi
  if [[ $(readlink "$web_root/current") != "releases/$release" ]]; then
    rm -rf -- "$release_dir" "$release_dir.partial"
  fi
  if ((${#failed[@]})); then
    printf 'Manual repair needed for: %s\n' "${failed[@]}" >&2
  fi
}
trap 'code=$?; rollback; exit "$code"' ERR
trap 'rollback; exit 130' INT HUP TERM

test ! -e "$release_dir"
rsync -a --delete --chown=root:root --chmod=D755,F644 "$repo_dir/dist/" "$release_dir.partial/"
mv -T "$release_dir.partial" "$release_dir"
ln -sfn "releases/$release" "$web_root/current.new"
mv -Tf "$web_root/current.new" "$web_root/current"

# The ingress serves the current link directly, so the link must resolve to a complete site.
test -f "$web_root/current/index.html"
test -f "$web_root/current/404.html"
trap - ERR INT HUP TERM

# Keep the newest releases; the current one is always among them.
find "$web_root/releases" -mindepth 1 -maxdepth 1 -type d \
  -regextype posix-extended -regex ".*/${release_pattern}" -printf '%f\n' \
  | sort | head -n "-$keep_releases" \
  | while IFS= read -r stale; do
      [[ releases/$stale == "$(readlink "$web_root/current")" ]] || rm -rf -- "${web_root:?}/releases/$stale"
    done

echo "Deployed $release."
