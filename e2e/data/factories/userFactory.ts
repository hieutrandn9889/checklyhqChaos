import { faker } from '@faker-js/faker';

export const UserFactory = {
  createValidUser: () => ({
    username: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }),

  createInvalidUser: () => ({
    username: faker.internet.email(),
    password: 'invalid_password',
  })
};