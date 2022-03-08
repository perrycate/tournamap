defmodule TournaMap.Router do
  use Trot.Router

  static "/" # Serve everything in priv/static as-is.

  get "/tournaments.json" do
    File.read!("tournaments.json") |> JSON.decode! # Lol.
  end

  import_routes Trot.NotFound
end
