# Jangle Core
> The foundation of Jangle CMS. 


## Overview

Jangle Core is the fundamental level of Jangle CMS. It is powered by the Mongoose ORM, and provides a layer of functions for our NodeJS application, that allows us to create, edit, and remove items and users.

What makes Jangle Core different than Mongoose are the built-in Authentication, History, and Publishing features. These are the basic features needed to have a Content Management System.

Mongoose schemas are what we'll provide the `jangle.start` function. They describe the shape of our content, and allow Jangle to understand what content we want to manage!



## Functions
> __`const jangle = require('@jangle/core')`__

When we require Jangle Core in our application, there are a few functions we have access to. This section gives us a breakdown of what is available.


### start
> __`jangle.start(config)`__

Start an instance of Jangle, returning a `Promise` with everything we'll need.

__Parameters__

- `config` : [Config](#config)

  ```ts
  // Defaults to
  {
    mongo: {
      content: 'mongodb://localhost/jangle',
      live: 'mongodb://localhost/jangle-live'
    },
    lists: {},
    items: {},
    secret: 'super-secret'
  }
  ```

__Returns__

Promise<[ProtectedJangleCore](#ProtectedJangleCore)>

__Example__

```ts
const jangle = require('@jangle/core')
const Schema = jangle.Schema

jangle
  .start({
    lists: {
      Author: new Schema({
        name: String,
        bio: {
          type: String,
          required: true
        }
      }),
      BlogPost: new Schema({
        title: String,
        date: Date,
        author: {
          type: Schema.Types.ObjectId,
          ref: 'Author'
        }
      })
    },
    items: {
      Homepage: new Schema({
        title: String,
        intro: String
      })
    }
  })
  .then(core => {
    console.log(core.lists)
    // { BlogPost: { ... }, Author: { ... } }
    console.log(core.items)
    // { Homepage: { ... } }
    console.log(core.auth)
    // { signUp: ..., signIn: ... }
  })
  .catch(reason => {
    console.error(reason)
    process.exit(1)
  })
```


## Types
> All the types of data that Jangle uses.

Jangle Core is built with Typescript, so we are able to use types throughout. These types help document the code, and allow us to talk about what we can expect for a function's input and output!


### Map
> An object with all values having one type.
    
```ts
type Map<T> = {
  [key: string]: T
}
```

__Example__
```ts
const mapOfNumbers : Map<number> = {
  apple: 1,
  banana: 2,
  cherry: 3
}

const mapOfLists : Map<number[]> = {
  apples: [ 1, 2 ],
  bananas: [ 3, 4, 5 ],
  cherries: []
}
```


### MongoUri
> A connection string to a MongoDB database.

__Example__

```ts
const local = `mongodb://localhost:27017/our-database`
const live = `mongodb://user@pass:host:54014/our-database`
```

__Related__

- [MongoDB Connection URIs](https://docs.mongodb.com/manual/reference/connection-string/)


### Config
> The configuration we provide to [jangle.start](#start).

```ts
export type Config = {
  mongo: {
    content: MongoUri
    live: MongoUri
  }
  lists: Map<Schema>
  items: Map<Schema>
  secret: string
}
```

__Example__

```ts
const config : Config = {
  mongo: {
    content: 'mongodb://localhost/jangle-content'
    live: 'mongodb://localhost/jangle-live'
  }
  lists: {
    Author: new Schema({
      name: String,
      bio: {
        type: String,
        required: true
      }
    }),
    BlogPost: new Schema({
      title: String,
      date: Date,
      author: {
        type: Schema.Types.ObjectId,
        ref: 'Author'
      }
    })
  },
  items: {
    Homepage: new Schema({
      title: String,
      intro: String
    })
  }
  secret: 'something-super-secret'
}
```

__Related__

- [MongoURI](#mongouri)
- [Map](#map)
- [Schema](http://mongoosejs.com/docs/guide.html)


### ProtectedJangleCore
> A core that still needs a user token for it's operations.

```ts
type ProtectedJangleCore = {
  lists: Map<ProtectedListService>
  items: Map<ProtectedItemService>
  auth: Authorization
}
```

__Example__

```ts
const example = (core : ProtectedJangleCore) => {
  const Author = core.lists.Author

  console.log(Author.find)
  // (token, params) => { ... }
  console.log(Author.create)
  // (token, params) => { ... }
  console.log(core.auth.canSignUp)
  // () => { ... }
}
```

__Related__

- [Map](#map)
- [ProtectedListService](#protectedlistservice)
- [ProtectedItemService](#protecteditemservice)
- [Authorization](#authorization)


### Protected
> Wraps a value or function so require a user token first.

This is used by [ProtectedListService](#protectedlistservice) to make sure that a user token is provided to all functions needing users.

```ts
type Protected<T> = (token: Token) => T
```

__Example__

```ts
const someBoolean : Protected<boolean> =
  true
const someProtectedBoolean : Protected<boolean> =
  (token: Token) => true

const someString : string =
  'Jangle'
const someProtectedString : Protected<string> =
  (token: Token) => 'Jangle'

const someFunction : Protected<Function> =
  () => 123
const someProtectedFunction : Protected<Function> =
  (token: Token) => () => 123
```


### ProtectedListService
> A [ListService](#listservice) that requires a user token for most requests.

```ts
type ProtectedListService = {

  any: Protected<AnyFunction>
  count: Protected<CountFunction>
  find: Protected<FindFunction>
  get: Protected<GetFunction>

  create: Protected<CreateFunction>
  update: Protected<UpdateFunction>
  patch: Protected<PatchFunction>
  remove: Protected<RemoveFunction>

  publish: Protected<PublishFunction>
  unpublish: Protected<UnpublishFunction>
  isLive: IsLiveFunction
  live: LiveService

  history: Protected<HistoryFunction>
  previewRollback: Protected<PreviewRollbackFunction>
  rollback: Protected<RollbackFunction>

  schema: SchemaFunction

}
```

__Related__

- [Protected](#protected)

To understand



## List Services
> How to interact with content that comes in lists.

Whether it's a list of blog posts, authors, or events, we'll need a way to create, edit, remove, publish, and restore items within our Jangle instance. That's where the List Service comes in.

Every list we create with the `lists` property will automatically generate a `ListService` that gives us these functions:


### ListService
> An object with functions to interact with a Jangle list.

```ts
type ListService = {

  any: AnyFunction
  count: CountFunction
  find: FindFunction
  get: GetFunction

  create: CreateFunction
  update: UpdateFunction
  patch: PatchFunction
  remove: RemoveFunction

  isLive: IsLiveFunction
  publish: PublishFunction
  unpublish: UnpublishFunction
  live: LiveService

  history: HistoryFunction
  previewRollback: PreviewRollbackFunction
  rollback: RollbackFunction

  schema: SchemaFunction

}
```

---

### List - Any
> Check if certain items exist.

```ts
type AnyFunction = (params?: AnyParams) => Promise<boolean>
```

__Parameters__

- `params` (optional) - query options
  ```ts
  type AnyParams = {
    where?: WhereOptions
  }
  ```

__Example__

```ts
// Return if there are any authors
Author.any()
  .then(console.log) // true

// Return if there are any authors with name "Ryan"
Author.any({ where: { name: 'Ryan' } })
  .then(console.log) // false
```

__Related__

- [WhereOptions](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)

---

### List - Count
> Check how many items exist.

```ts
type CountFunction = (params?: CountParams) => Promise<number>
```

__Parameters__

- `params` (optional) - query options
  ```ts
  type CountParams = {
    where?: WhereOptions
  }
  ```

__Example__

```ts
// Return how many authors exist
Author.count()
  .then(console.log) // 5

// Return how many authors have name "Ryan"
Author.count({ where: { name: 'Ryan' } })
  .then(console.log) // 0
```

__Related__

- [WhereOptions](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)

---

### List - Find
> Look for a list of items.

```ts
type FindFunction = (params?: FindParams) => Promise<IJangleItem[]>
```

__Parameters__

- `params` (optional) - query options
  ```ts
  type FindParams = {
    where?: WhereOptions
    skip?: number
    limit?: number
    populate?: string | PopulateOptions
    select?: string | SelectOptions
    sort?: string | SortOptions
  }
  ```

__Example__

```ts
// Find all authors
Author.find()

// Find all authors with name "Ryan"
Author.find({ where: { name: 'Ryan' } })

// Find all authors and sort them by name
Author.find({ sort: 'name' })

// Find all blog posts, and populate the author
BlogPost.find({ populate: 'author' })

// Find first ten authors
Author.find({ limit: 10 })

// Find first ten authors, but only their names
Author.find({ limit: 10, select: 'name' })
```

__Related__

- [WhereOptions](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)
- [PopulateOptions](http://mongoosejs.com/docs/api.html#query_Query-populate)
- [SelectOptions](http://mongoosejs.com/docs/api.html#query_Query-select)
- [SortOptions](http://mongoosejs.com/docs/api.html#query_Query-sort)

---

### List - Get
> Get an item by ID.

```ts
type GetFunction = (id: Id, params?: GetParams) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

- `params` (optional) - query options
  ```ts
  type GetParams = {
    populate?: string | PopulateOptions
    select?: string | SelectOptions
  }
  ```

__Example__

```ts
// Find all authors
Author.get(id)

// Get a blog posts and populate its author field
BlogPost.find(id, { populate: 'author' })

// Get an author, but only their name
Author.find({ select: 'name' })
```

__Related__

- [PopulateOptions](http://mongoosejs.com/docs/api.html#query_Query-populate)
- [SelectOptions](http://mongoosejs.com/docs/api.html#query_Query-select)

---

### List - Create
> Create a new item.

```ts
type CreateFunction = (newItem: object) => Promise<IJangleItem>
```

__Parameters__

- `newItem` - the item you want to create.

__Example__

```ts
// Create an author with name "Ryan"
Author.create({ name: 'Ryan' })
  .then(author =>
    createBlogPostBy(author)
  )

// Create a blog post by that author
const createBlogPostBy = (author) =>
  BlogPost.create({
    title: 'Jangle is easy!',
    author: author._id
  })
```

---

### List - Update
> Completely replace an existing item.

```ts
type UpdateFunction = (id: Id, newItem: object) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

- `newItem` - the item you want to create.

__Example__

```ts
// Update the author with name "Mr. Ryan"
Author.update(authorId, {
  name: 'Mr. Ryan'
})

// Update the blog post with a new author
BlogPost.update(blogPostId, {
  title: 'Jangle is Easy!',
  author: someOtherAuthorId
})
```

---

### List - Patch
> Partially update an existing item.

```ts
type PatchFunction = (id: Id, newValues: Map<any>) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

- `newValues` - the values you want to change.

__Example__

```ts
// Change the name field for the author to "Dr. Ryan"
Author.patch(authorId, {
  name: 'Dr. Ryan'
})

// Remove the author from the blog post
// (The title stays the same!)
BlogPost.patch(blogPostId, {
  author: null
})
```

---

### List - Remove
> Remove an item from the list.

```ts
type RemoveFunction = (id: Id) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

__Example__

```ts
// Remove the author
Author.remove(authorId)

// Remove the blog post
BlogPost.remove(blogPostId)
```

---

### List - Is Live
> Check if an item is published.

```ts
type IsLiveFunction = (id: Id) => Promise<boolean>
```

__Parameters__

- `id` - the ID of the item.

__Example__

```ts
// Check if author is published
Author.isLive(authorId)

// Check if a blog post is published
BlogPost.isLive(blogPostId)
```

---

### List - Publish
> Publish an item to the live database.

```ts
type PublishFunction = (id: Id) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

__Example__

```ts
// Publish an author
Author.publish(authorId)

// Publish a blog post
BlogPost.publish(blogPostId)
```

---

### List - Unpublish
> Unpublish an item to the live database.

```ts
type UnpublishFunction = (id: Id) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

__Example__

```ts
// Unpublish an author
Author.unpublish(authorId)

// Unpublish a blog post
BlogPost.unpublish(blogPostId)
```

---

### List - Live
> Provides functions for reading published items (no user token required!)

```ts
type LiveService = {
  any: AnyFunction
  count: CountFunction
  find: LiveFindFunction
  get: LiveGetFunction
}
```

__Examples__

```ts
// Find if there are any published authors.
Author.live.any()

// Find out how many authors are published.
Author.live.count()

// Find all published authors.
Author.live.find()

// Get a published author by ID.
Author.live.get(someId)
```

__Related__

- [Any](#list-any)
- [Count](#list-count)
- [Find](#list-any)
- [Get](#list-get)

---

### List - History
> View history for an item.

```ts
type HistoryFunction = (id: Id) => Promise<IHistory[]>
```

__Parameters__

- `id` - the ID of the item.

__Example__

```ts
// Get history for an author
Author.history(authorId)
```

---

### List - Preview Rollback
> Preview what a rollback to an older version of an item might look like.

```ts
type PreviewRollbackFunction = (id: Id, version?: number) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

- `version` - the version to rollback to.

__Example__

```ts
// Preview a rollback to the last version
Author.previewRollback(authorId)

// Preview a rollback to version 2
Author.previewRollback(authorId, 2)
```

---

### List - Rollback
> Rollback to an older version of an item.

```ts
type RollbackFunction = (id: Id, version?: number) => Promise<IJangleItem>
```

__Parameters__

- `id` - the ID of the item.

- `version` - the version to rollback to.

__Example__

```ts
// Rollback to the last version
Author.rollback(authorId)

// Rollback to version 2
Author.rollback(authorId, 2)
```

---

### List - Schema
> Get information about the list.

```ts
type SchemaFunction = () => Promise<JangleSchema>
```

__Returns__

```ts
type JangleSchema = {
  name: string
  slug: string
  labels: {
    singular: string
    plural: string
  }
  fields: JangleField[]
}

type JangleField = {
  name: string
  label: string
  type: string
  default: string
  required: boolean
}
```

__Example__

```ts
// Get the plural form of Author:
Author.schema()
  .then(schema => schema.labels.plural) // "authors"

// Get the fields for the Author list:
Author.schema()
  .then(schema => schema.fields) // [ ... ]
```

---