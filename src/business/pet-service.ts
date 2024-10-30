import { Pet, PetProperties } from './pet-type';
import { JsonFileStore } from '../utils/json-file-store';
import { PetRepository } from '../data-access/pet-repository';

export class PetService {
  private readonly repository;

  constructor(repository: PetRepository) {
    this.repository = repository;
  }

  async born(name: string) {
    // data access
    const newPet: PetProperties = {
      name,
      food: 1,
      weight: 1,
      age: 1,
    };

    const created = await this.repository.create(newPet);
    return created;
  }

  async listPets() {
    const petList = await this.repository.readAll();
    return petList;
  }

  async getPet(id: number) {
    const pet = await this.repository.readById(id);
    return pet;
  }
}
