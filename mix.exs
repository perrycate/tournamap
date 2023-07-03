defmodule Tournamap.MixProject do
  use Mix.Project

  def project do
    [
      app: :tournamap,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:httpoison, "~> 1.8"},
      {:json, "~> 1.4"},
      {:phoenix_html, github: "phoenixframework/phoenix_html"},
      {:ssl_verify_fun, "~>1.1.0", [env: :prod, hex: "ssl_verify_fun", repo: "hexpm", optional: false, manager: :rebar3, override: :true]}
    ]
  end
end
