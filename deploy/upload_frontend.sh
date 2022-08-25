#!/bin/sh
# Build site using the scripts/build.js build script,
# then upload everything to Amazon S3.
#
# Must be run from the root of the project.
# Assumes the build folder has not been changed from `/build/`.

# Switches react to production mode, minifies stuff, etc.
npm run build

# We keep a sample copy of our tournament data in public/ so people can
# easily run the project for frontend dev without having elixir on their
# system. This data gets very stale, so don't copy it.
rm build/tournaments.json

# Upload files.
aws s3 sync build/ s3://tournamap.gg/

# Start a cache invalidation for our CDN.
aws cloudfront create-invalidation --distribution-id EUR7VJJJUF4IY --path '/*'
