#!/bin/sh
# Load the docker image for our fetcher script from a compressed file.

# Docker load apparently supports gzipped files too.
docker load < tournamap-download.tar.gz 
