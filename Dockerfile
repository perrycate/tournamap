FROM elixir:1.13.3-alpine
WORKDIR /tournamap
COPY . .
RUN apk add --no-cache aws-cli git
RUN yes | mix deps.get
RUN yes | mix compile # TODO there's gotta be some "build for production" option We're neglecting to use here.
ENTRYPOINT ["./upload.sh"]
