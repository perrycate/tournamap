#!/bin/sh
# The commands to download tournament data and upload to amazon S3.
# You must have elixir, mix, aws cli, etc. on your system, and the S3 bucket
# should be one you control.

# Really we ought to package the update_tourneys thing properly instead of
# building it on whatever machine is running this. Oh well.
mix run -e Util.update_tourneys
# Also there's an assumption here that update_tourneys is actually writing a
# file named exactly tournaments.json. Really we should just be passing in
# a file name or something, or better yet just writing it to stdout or something.
aws s3 cp ./tournaments.json s3://tournamap.gg/
