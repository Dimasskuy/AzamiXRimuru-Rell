{ pkgs }: {
  deps = [
    pkgs.jellyfin-ffmpeg
    pkgs.unzip
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}