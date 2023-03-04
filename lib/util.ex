defmodule Util do
  @auth_env_var "SMASH_GG_TOKEN"
  @default_storage_file "tournaments.json"

  def update_tourneys do
    case get_all_tourneys() do
      {:ok, tourneys} ->
        tourneys
        |> JSON.encode!
        |> then(&File.write!(@default_storage_file, &1))
      {:error, reason} ->
        IO.puts(:stderr, reason)
        System.stop(1)
    end

  end

  def get_all_tourneys do
    case System.get_env(@auth_env_var) do
      nil -> {:error, "No auth token specified. Make sure #{@auth_env_var} is set in the environment"}
      auth ->
        tourneys = get_tourney_page([], auth, 1)

        { :ok, %{ tournament_data: tourneys, metadata: %{ updated_at: DateTime.now!("Etc/UTC") |> DateTime.to_unix()}} }
    end
  end

  def get_tourney_page(tourney_list, auth, page_num) do
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

    case HTTPoison.post("https://api.start.gg/gql/alpha", JSON.encode!(body), headers) do
      {:ok, resp} ->
        tourney_data = resp.body
                      |> JSON.decode()
                      |> extract_data()

        total_pages = tourney_data
                      |> Map.get("pageInfo")
                      |> Map.get("totalPages")

        cond do
          total_pages < 1 ->
            IO.puts(:stderr, "No tournament pages found.")
            System.stop(1)
          page_num < total_pages ->
            # There are more pages. Add the entries from this page to the
            # tourney list and get the next page.
            this_page = format_raw_data(tourney_data)
            get_tourney_page(this_page ++ tourney_list, auth, page_num + 1)
          page_num == total_pages ->
            # This is the last page.
            this_page = format_raw_data(tourney_data)
            this_page ++ tourney_list
        end
      {:error, reason} ->
        IO.puts(:stderr, reason)
        System.stop(1)
    end
  end

  def extract_data({:ok, decoded_map = %{"success" => false}}) do
    IO.puts(:stderr, Map.get(decoded_map, "message"))
    System.stop(1)
  end

  def extract_data({:ok, decoded_map}) do
    decoded_map
    |> Map.get("data")
    |> Map.get("tournaments")
  end

  def format_raw_data(tourney_data) do
    tourney_data
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
      end )
  end
end
