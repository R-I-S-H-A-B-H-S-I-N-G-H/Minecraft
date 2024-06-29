import { AmbientLight, BoxGeometry, Color, DirectionalLight, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial } from "three";
import { generate2dNoise, generate3dNoise } from "../Utils/Noise";
import { blocks, resourceBlocks } from "./Blocks";

const geometry = new BoxGeometry();

interface Size {
	width: number;
	height: number;
	blockSize?: number;
}

interface blockData {
	id: number;
	instanceId: number | null;
}

export class World extends Group {
	size: Size;
	data: blockData[][][];
	params: {
		terrain: {
			scale: number;
			magnitude: number;
			offset: number;
		};
	};

	constructor(size: Size) {
		super();
		this.size = size;
		this.data = [];
		this.params = {
			terrain: {
				scale: 30,
				magnitude: 0.5,
				offset: 0.2,
			},
		};
	}

	getTotalBlocks(): number {
		return this.size.width * this.size.height * this.size.width;
	}

	getBlockSize(): number {
		return this.size.blockSize ?? 1;
	}

	notInBounds(x: number, y: number, z: number): boolean {
		return x < 0 || x >= this.size.width || y < 0 || y >= this.size.height || z < 0 || z >= this.size.width;
	}

	inBounds(x: number, y: number, z: number): boolean {
		return !this.notInBounds(x, y, z);
	}

	getBlock(x: number, y: number, z: number) {
		if (this.notInBounds(x, y, z)) return null;
		return this.data[x][y][z];
	}

	setBlockId(x: number, y: number, z: number, id: number) {
		if (this.notInBounds(x, y, z)) return null;
		this.data[x][y][z].id = id;
	}

	setBlockInstanceId(x: number, y: number, z: number, instanceId: number) {
		if (this.notInBounds(x, y, z)) return null;
		this.data[x][y][z].instanceId = instanceId;
	}

	isBlockObscured(x: number, y: number, z: number) {
		const up = this.getBlock(x, y + 1, z)?.id ?? blocks.empty.id;
		const down = this.getBlock(x, y - 1, z)?.id ?? blocks.empty.id;
		const left = this.getBlock(x + 1, y, z)?.id ?? blocks.empty.id;
		const right = this.getBlock(x - 1, y, z)?.id ?? blocks.empty.id;
		const forward = this.getBlock(x, y, z + 1)?.id ?? blocks.empty.id;
		const back = this.getBlock(x, y, z - 1)?.id ?? blocks.empty.id;

		if (up === blocks.empty.id || down === blocks.empty.id || left === blocks.empty.id || right === blocks.empty.id || forward === blocks.empty.id || back === blocks.empty.id) return false;
		return true;
	}

	generate() {
		this.initializeTerrain();
		this.generateResources();
		this.generateTerrain();
		this.generateMeshes();
	}

	initializeTerrain(): void {
		this.data = [];

		for (let x = 0; x < this.size.width; x++) {
			const slice = [];
			for (let y = 0; y < this.size.height; y++) {
				const row: blockData[] = [];
				for (let z = 0; z < this.size.width; z++) {
					row.push({
						id: blocks.empty.id,
						instanceId: null,
					});
				}
				slice.push(row);
			}
			this.data.push(slice);
		}
	}

	generateResources() {
		resourceBlocks.forEach((resource) => {
			for (let x = 0; x < this.size.width; x++) {
				for (let z = 0; z < this.size.width; z++) {
					for (let y = 0; y < this.size.height; y++) {
						const value = generate3dNoise(x / resource.scale.x, y / resource.scale.y, z / resource.scale.z, resource.name);
						if (value > resource.scarcity) {
							this.setBlockId(x, y, z, resource.id);
						}
					}
				}
			}
		});
	}

	generateTerrain() {
		for (let x = 0; x < this.size.width; x++) {
			for (let z = 0; z < this.size.width; z++) {
				const value = generate2dNoise(x / this.params.terrain.scale, z / this.params.terrain.scale);
				const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;
				let height = Math.floor(this.size.height * scaledNoise);

				height = Math.max(0, Math.min(height, this.size.height - 1));

				for (let y = 0; y < this.size.height; y++) {
					if (y > height) {
						this.setBlockId(x, y, z, blocks.empty.id);
						continue;
					}

					const block = this.getBlock(x, y, z);
					if (block?.id) continue;

					const blockId = y === height ? blocks.grass.id : blocks.dirt.id;
					this.setBlockId(x, y, z, blockId);
				}
			}
		}
	}

	generateMeshes(): void {
		this.clear();
		const maxBlocks = this.getTotalBlocks();

		const meshes: Map<number, InstancedMesh> = new Map();

		Object.values(blocks)
			.filter((blockType) => blockType.id != blocks.empty.id)
			.forEach((blockType) => {
				const mesh = new InstancedMesh(geometry, blockType.material, maxBlocks);
				mesh.count = 0;
				mesh.name = blockType.name;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				meshes.set(blockType.id, mesh);
			});

		const matrix = new Matrix4();
		const blockSize = this.getBlockSize();
		for (let x = 0; x < this.size.width; x++) {
			for (let y = 0; y < this.size.height; y++) {
				for (let z = 0; z < this.size.width; z++) {
					const block = this.getBlock(x, y, z);

					if (!block || block.id === 0 || this.isBlockObscured(x, y, z)) continue;

					const mesh = meshes.get(block.id);
					if (!mesh) continue;

					const instanceId = mesh.count;
					this.setBlockInstanceId(x, y, z, instanceId);

					matrix.setPosition(x * blockSize + blockSize / 2.0, y * blockSize + blockSize / 2.0, z * blockSize + blockSize / 2.0);
					mesh.setMatrixAt(instanceId, matrix);
					mesh.count++;
				}
			}
		}

		const val = meshes.values();

		this.add(...val);
	}
}
