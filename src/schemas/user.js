const errorSchema = require('./error')

const properties = {
  id: {
    type: 'string',
    format: 'uuid',
    description: "The user's unique identifier",
    // example: '5d8e8a7e-e8e3-4d8e-b3d7-8e4b50e36b1c',
  },
  username: {
    type: 'string',
    description: 'Username of the user',
    // example: 'Marshall',
  },
  password: {
    type: 'string',
    description: 'User password',
    // example: 'h31l0|w0rlD!',
  },
  createdAt: {
    type: 'string',
    description: 'Sign up date',
    // example: '2022-09-28T19:05:43.633Z',
  },
  modified: {
    type: 'string',
    description: 'Modified date',
    // example: '2022-09-28T19:05:43.633Z',
  },
  entity: {
    type: 'string',
    description: 'User',
  },
}

const tags = ['user']

const signup = {
  description: 'User sign up',
  summary: 'Sign up a user',
  tags,
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'Username of the user',
      },
      password: {
        type: 'string',
        description: 'User password',
      },
    },
    additionalProperties: false,
  },
  response: {
    default: {
      description: 'Success: User signed up',
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'User token',
        },
      },
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXh0IjoiZTVlMjRlNzctZjVlNi00ODU5LWIxMTItNjg0NTU2NDRhOWNhIiwiaWF0IjoxNjYzMDAwMjM0LCJleHAiOjM2MDAwMDAwMDE2NjMwMDAwMDB9.vejKSPTblWG-lNOFVcW48XiaC2xb3jhI_uaHQFXjJww',
      },
    },
    409: {
      description: 'Conflict Error',
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: errorSchema,
        },
      },
      example: {
        error: {
          status: '409',
          code: 'duplicate-parameter',
          title: 'User with username already exists.',
          source: {
            pointer: '/username',
          },
        },
      },
    },
    422: {
      description: 'Unprocessable entity',
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: errorSchema,
        },
      },
      example: {
        error: {
          status: '422',
          code: 'parameter-required',
          title: 'Password is required.',
          source: {
            pointer: '/password',
          },
        },
      },
    },
  },
}

const signin = {
  description: 'User sign in',
  summary: 'Sign in a user',
  tags,
  body: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'Username of the user',
      },
      password: {
        type: 'string',
        description: 'User password',
      },
    },
    additionalProperties: false,
  },
  example: {
    username: 'Marshall',
    password: 'whatever',
  },
  response: {
    default: {
      description: 'Success: User signed in',
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'User token',
        },
        data: properties,
      },
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXh0IjoiZTVlMjRlNzctZjVlNi00ODU5LWIxMTItNjg0NTU2NDRhOWNhIiwiaWF0IjoxNjYzMDAwNDM0LCJleHAiOjM2MDAwMDAwMDE2NjMwMDA2MDB9.Rei7AyDe2pS7jomOfLRb2HCidtNvq0bg-HJu0riAHTU',
        data: {
          createdAt:
            'Mon Sep 12 2022 16:30:25 GMT+0000 (Coordinated Universal Time)',
          created: '2022-09-12T16:30:34.921Z',
          modified: '2022-09-12T16:30:34.921Z',
          id: 'e5e24e77-f5e6-4859-b112-68455644a9ca',
          entity: 'User',
          username: 'Marshall',
        },
      },
    },
    404: {
      description: 'Not found',
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: errorSchema,
        },
      },
      example: {
        error: {
          status: '404',
          code: 'not-found',
          title: "Username doesn't exist.",
          source: {
            pointer: '/username',
          },
        },
      },
    },
    422: {
      description: 'Unprocessable entity',
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: errorSchema,
        },
      },
      example: {
        error: {
          status: '422',
          code: 'parameter-required',
          title: 'Please provide an username.',
          source: {
            pointer: '/username',
          },
        },
      },
    },
  },
}

module.exports = {
  properties,
  signup,
  signin,
}
