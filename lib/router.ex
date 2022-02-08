defmodule TournaMap.Router do
  use Trot.Router

  get "/tournaments" do
    File.read!("tournaments.json") |> JSON.decode! # Lol.
  end
end
