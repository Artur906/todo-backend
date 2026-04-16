import { faker } from '@faker-js/faker'

const userFactory = (email, password) => {
  return {
    email: email || faker.internet.email(),
    password: password || faker.internet.password()
  }
}

const taskFactory = ({title, description, userId}) => {
  return {
    title: title || faker.lorem.sentence(),
    description: description || faker.lorem.paragraph(),
    userId: userId || 'mocked_user_id'
  }
}

export { userFactory, taskFactory }