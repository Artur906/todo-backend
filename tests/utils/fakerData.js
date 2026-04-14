import { faker } from '@faker-js/faker'

const userFactory = (email, password) => {
  return {
    email: email || faker.internet.email(),
    password: password || faker.internet.password()
  }
}

export { userFactory }