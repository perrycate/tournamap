defmodule Util do
  @auth_env_var "SMASH_GG_TOKEN"
  @default_storage_file "tournaments.json"

  def update_tourneys(filename \\ @default_storage_file) do
    {:ok, tourneys} = get_all_tourneys()
    tourneys
    |> JSON.encode!
    |> then(&File.write!(filename, &1))
  end

  def get_all_tourneys do
    case System.get_env(@auth_env_var) do
      nil -> {:error, "No auth token specified. Make sure #{@auth_env_var} is set in the environment"}
      auth ->
        # Rather than write code to figure out how many pages there are...
        # let's just assume there are no more than 10 lol.
        # (At time of writing there are less than 1,000 upcoming tournaments,
        # which can easily fit in only 2 pages.)
        tourneys = 1..10
                   |> Enum.map(&get_tourney_page(auth, &1))
                   |> List.flatten
        {:ok, tourneys}
    end
  end

  def get_tourney_page(auth, page_num) do
    body = %{
      "query" => "query AllUltimateTournaments($perPage: Int, $pageNum: Int) {
  tournaments(query: {
    page: $pageNum,
    perPage: $perPage
    filter: {
      videogameIds: [1386]
      upcoming: true
      hasOnlineEvents: false
    }
  }) {
    pageInfo {
      total
      totalPages
      page
      perPage
      sortBy
      filter
    }
    nodes {
      id
      name
      lat
      lng
      startAt
      endAt
      updatedAt
      slug
    }
  }
}",
      "variables" => %{
        "perPage" => 500,
        "pageNum" => page_num
      }
    }

    headers = [
      "Content-Type": "application/json",
      Authorization: "Bearer " <> auth
    ]

    {:ok, resp} = HTTPoison.post("https://api.start.gg/gql/alpha", JSON.encode!(body), headers)

    resp.body
    |> JSON.decode!()
    |> Map.get("data")
    |> Map.get("tournaments")
    |> Map.get("nodes")
    # Finesse data into our own non-start.gg format.
    |> Enum.map(fn sgg_data ->
      %{
        "external_id" => "smashgg-" <> Integer.to_string(sgg_data["id"]),
        "name" => sgg_data["name"],
        "location" => %{
          "lat" => sgg_data["lat"],
          "lng" => sgg_data["lng"]
        },
        "start_time" => sgg_data["startAt"],
        "end_time" => sgg_data["endAt"],
        "updated_at" => sgg_data["updatedAt"],
        "url" => "https://start.gg/" <> (sgg_data["slug"])
      }
    end)
  end
end
