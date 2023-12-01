{pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
  nativeBuildInputs = [
    pkgs.nodejs
    pkgs.yarn
    pkgs.git
  ];
}