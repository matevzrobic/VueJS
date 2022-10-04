{ pkgs ? import <nixpkgs> {}, }:

with pkgs.stdenv;

mkDerivation rec {
	pname = "DogWalkersBackend";
	version = "0.0.1";

	nativeBuildInputs = with pkgs; [
		nodejs-14_x
	];
}
