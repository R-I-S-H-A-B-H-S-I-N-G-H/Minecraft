import alea from "alea";
import { createNoise2D, createNoise3D } from "simplex-noise";

export function generate2dNoise(x: number, y: number, seed: any = "seed") {
	// create a new random function based on the seed
	const prng = alea(seed);

	// use the seeded random function to initialize the noise function
	return createNoise2D(prng)(x, y);
}

export function generate3dNoise(x: number, y: number, z: number, seed: any = "seed") {
	// create a new random function based on the seed
	const prng = alea(seed);

	// use the seeded random function to initialize the noise function
	return createNoise3D(prng)(x, y, z);
}
