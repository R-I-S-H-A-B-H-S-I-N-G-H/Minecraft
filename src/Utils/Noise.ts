import { makeNoise2D, makeNoise3D } from "open-simplex-noise";

export function getNoise2dGen(seed: any = "seed") {
	return makeNoise2D(seed);
}

export function getNoise3dGen(seed: any = "seed") {
	return makeNoise3D(seed);
}
