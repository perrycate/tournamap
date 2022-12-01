#!/bin/sh
# Load the docker image for our fetcher script from a compressed file.

# Docker load apparently supports compressed files too.
docker load < tournamap-download.tar.bz2
