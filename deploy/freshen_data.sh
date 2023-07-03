#!/bin/sh
# Download tournament data and upload to amazon S3.
# You must have elixir, mix, aws cli, etc. on your system, and the S3 bucket
# should be one you control.

# Exit if anything returns a non-zero status.
set -e

# There's an assumption here that update_tourneys is actually writing a
# file named exactly tournaments.json. Really we should just be passing in
# a file name or something, or better yet just writing it to stdout or something.
DATA_FILE_NAME="./tournaments.json"

# Really we ought to package the update_tourneys thing properly instead of
# building it on whatever machine is running this. Oh well.
yes | MIX_ENV=prod ERL_FLAGS="-smp 'enable' -smp maxt 1" mix run -e Util.update_tourneys


# Only upload anything if the data file isn't empty.
if [ $(cat $DATA_FILE_NAME | wc -c) -gt 0 ]
then
    aws s3 cp $DATA_FILE_NAME s3://tournamap.gg/
else
    echo "Data file '$DATA_FILE_NAME' empty!" >&2
fi
