{ pkgs, ... }: {
  channel = "stable-25.05";
  packages = [
    pkgs.nodejs_24
    pkgs.gnupg
    pkgs.openssh
    pkgs.pnpm
  ];
  env = { };
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "mhutchie.git-graph"
      "oderwat.indent-rainbow"
      "esbenp.prettier-vscode"
      "google.gemini-cli-vscode-ide-companion"
    ];
    previews = {
      enable = false;
    };
    workspace = {
      onCreate = {
        pnpm-install = "pnpm install";
        default.openFiles = [ "README.md" ];
      };
      onStart = { };
    };
  };
}
