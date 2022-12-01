#!/bin/sh
# Create the docker image for our fetcher script and save it to a tar file.
# This tar file can then be copied to a server somewhere, for example after
# making fetcher code changes.
docker build -t tournamap-download .
docker save tournamap-download | bzip2 > tournamap-download.tar.bz2
