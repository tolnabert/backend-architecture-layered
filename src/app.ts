import fastify from 'fastify';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import cors from '@fastify/cors';
import { PathLike } from 'node:fs';
import { JsonFileStore } from './utils/json-file-store';
import { Pet } from './business/pet-type';
import { PetService } from './business/pet-service';
import { PetRepository } from './data-access/pet-repository';

export default async function createApp(options = {}, dataFilePath: PathLike) {
  const app = fastify(options).withTypeProvider<JsonSchemaToTsProvider>();
  await app.register(cors, {});

  const petStore = new JsonFileStore<Pet>(dataFilePath);
  const petRepository = new PetRepository(petStore);
  const petService = new PetService(petRepository);

  const postPetSchema = {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
      additionalProperties: false,
    },
  } as const;

  // reply schema for all pets

  const getByIdPetSchema = {
    // new test for getbyid
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
      },
      required: ['id'],
      additionalProperties: false,
    },
  } as const;

  app.post('/pets', { schema: postPetSchema }, async (request, reply) => {
    // read the http REQUEST parameters
    const { name } = request.body;

    // business logic
    const newPet = petService.born(name);

    // HTTP RESPONSE
    reply.status(201);
    return newPet;
  });

  app.get('/pets', async () => {
    const petList = await petService.listPets();
    return petList;
  });

  app.get('/pets/:id', { schema: getByIdPetSchema }, async (request, reply) => {
    const { id } = request.params;

    const petToFind = await petService.getPet(id);
    return petToFind;
  });

  return app;
}
