---
sidebar: auto
---

# Jangle API
> The RESTful API built on top of Jangle Core.

## Overview

Jangle Core did all the hard work: Storing content, publishing, history, authentication. Jangle API is the layer on top that allows us to access our Jangle CMS content via automatically generated API endpoints.

This API is broken up into these major components:

- [Authentication API](#authentication-api)
- [List API](#list-api)
- [Item API]()

### Using Tokens

Both the List and Items API have certain endpoints that require a user token to interact with our content.

If we try to view unpublished items, edit an item, or delete something, Jangle needs to verify that we are an actual user in the system.

Otherwise, anyone could hit these URLs and ruin our day!

(The [Authentication API](#authentication-api) has endpoints for retrieving a valid user token.)


__How to provide a token to Jangle API__

Protected endpoints will check these places for a user token:

- `Authorization` header, with the `Bearer` schema (__recommended__)
	```http
	Authorization: Bearer our-token
	```

- As a query parameter in your URL (for testing)
	```http
	GET /api/lists/authors?token=our-token
	```


## Authentication API
> Creating users, signing in, getting tokens.



### Can Sign Up
> __`GET`__ `/api/auth/can-sign-up`

Find out if sign-up is allowed. Useful for sign-up / sign-in screens.

__Example__
```
GET /api/auth/can-sign-up
```

__Returns__

If sign up is allowed:

```js
{
  "error": false,
  "message": "Sign up allowed!",
  "data": true
}
```

If another user already exists:

```js
{
  "error": false,
  "message": "Cannot sign up.",
  "data": false
}
```



### Sign Up
> __`POST`__ `/api/auth/sign-up`

Create a new user for our Jangle instance, if no other users exist in the system.

__Body__

- `name` - The display name for the new user.
- `email` - The email for the new user.
- `password` - The password for the new user.

__Example__

```js
{
  "name": "Ryan",
  "email": "ryan.nhg@gmail.com",
  "password": "jangleIsEasy"
}
```

__Returns__

If everything went okay, and the user was signed up:

```js
{
  "error": false,
  "message": "Sign up successful!",
  "data": {
    "name": "Ryan",
    "email": "ryan.nhg@gmail.com",
    "token": "<ryans-token>"
  }
}
```

If a user already exists (`/api/auth/can-sign-up` returned `false`):

```js
{
  "error": true,
  "message": "Admin user already exists.",
  "data": null
}
```

If the user provided was invalid:

```js
{
  "error": true,
  "message": "Could not create admin user.",
  "data": null
}
```



### Sign In
> __`POST`__ `/api/auth/sign-in`

Sign in an existing Jangle user.

__Body__

- `email` - The email for the new user.
- `password` - The password for the new user.

__Example__

```js
{
  "email": "ryan.nhg@gmail.com",
  "password": "jangleIsEasy"
}
```

__Returns__

If the sign in was successful:

```js
{
  "error": false,
  "message": "Sign in successful!",
  "data": {
    "name": "Ryan",
    "email": "ryan.nhg@gmail.com",
    "token": "<ryans-token>"
  }
}
```

If that user doesn't exist or the password doesn't match:

```js
{
  "error": true,
  "message": "Failed to sign in.",
  "data": null
}
```



## List API
> Viewing and updating items in Jangle Lists.

### Overview

The List API exposes Jangle Core's function using RESTful API standards. Once you are familar with the List API, the Items API will feel super easy!

Here are all the endpoints for the List API:

__Viewing Items__
- [Any](#any) - Returns if any items exist.
- [Count](#count) - Returns how many items we have.
- [Find](#find) - Finds items based on criteria.
- [Get](#get) - Gets an item by id.

__Editing Items__
- [Create](#create) - Create a new item.
- [Update](#update) - Fully replace an exising item.
- [Patch](#patch) - Partially update an exising item.

__Removing Items__
- [Remove](#remove) - Remove an exising item.
- [Restore](#restore) - Restore a removed item.

__History__
- [History](#history) - View an item's history.
- [Preview Rollback](#preview-rollback) - Preview a rollback, before committing it.
- [Rollback](#rollback) - Rollback to a previous version.

__Publishing__
- [Publish](#publish) - Publish an item.
- [Unpublish](#unpublish) - Unpublish an item.
- [Is Live](#is-live) - Check if an item is published.


### Any
> __`GET`__ `/api/lists/:name/any`

__Note:__ If provided a user token, this will work with all items. Without a token, this will only work with _published_ items.

__Options__

__`where`__ - a JSON object filtering results. Uses the MongoDB [query selector format](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors).

__Examples__

```http
GET /api/lists/people/any
GET /api/lists/people/any?where={ "name": "Ryan" }
```

__Returns__

If any items were found:

```js
{
  "error": false,
  "message": "Found some items.",
  "data": true
}
```

If no items were found:

```js
{
  "error": false,
  "message": "No items found.",
  "data": false
}
```



### Count
> __`GET`__ `/api/lists/:name/count`

__Note:__ If provided a user token, this will work with all items. Without a token, this will only work with _published_ items.

__Options__

__`where`__ - a JSON object filtering results. Uses the MongoDB [query selector format](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors).

__Examples__

```http
GET /api/lists/people/count
GET /api/lists/people/count?where={ "age": { "$gte": 24 } }
```

__Returns__

If any items were found:

```js
{
  "error": false,
  "message": "Found 1 item.",
  "data": 1
}
```

If no items were found:

```js
{
  "error": false,
  "message": "Found 0 items.",
  "data": 0
}
```



### Find
> __`GET`__ `/api/lists/:name`

Finds items, returning them in a paginated list. (Max page size is 25)

__Note:__ If provided a user token, this will work with all items. Without a token, this will only work with _published_ items.

__Options__

__`where`__ - a JSON object filtering results. Uses the MongoDB [query selector format](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors).

__`select`__ - a list of fields you are interested in returning. Uses Mongoose's [select format](http://mongoosejs.com/docs/api.html#query_Query-select).

__`populate`__ - an object using the Mongoose [populate format](http://mongoosejs.com/docs/api.html#query_Query-populate). (Useful for getting related items in one query.)

__`sort`__ - The field or fields you want to sort by. Uses the Mongoose [sort format](http://mongoosejs.com/docs/api.html#query_Query-sort).

__`page`__ - The page number to return, defaults to 1.

__Examples__

```http
GET /api/lists/people
GET /api/lists/people?select=name,age
GET /api/lists/people?where={ "age": { "$gte": 18 } }
GET /api/lists/people?sort=name
GET /api/lists/people?populate=friends
GET /api/lists/people?page=2
```

__Returns__

If items were found:

```js
{
  "error": false,
  "message": "Found 30 items.",
  "data": {
    total: 30,
    items: [
      { /* 1 */ },
      { /* 2 */ },
      { /* 3 */ },
      { /* 4 */ },
      /*...*/
      { /* 25 */ }
    ]
  }
}
```

If no items were found:

```js
{
  "error": false,
  "message": "Found 0 items.",
  "data": {
    total: 0,
    items: []
  }
}
```



### Get
> __`GET`__ `/api/lists/:name/:id`

Get an item with the provided id.

__Note:__ If provided a user token, this will work with all items. Without a token, this will only work with _published_ items.

__Options__

__`select`__ - a list of fields you are interested in returning. Uses Mongoose's [select format](http://mongoosejs.com/docs/api.html#query_Query-select).

__`populate`__ - an object using the Mongoose [populate format](http://mongoosejs.com/docs/api.html#query_Query-populate). (Useful for getting related items in one query.)

__Examples__

```http
GET /api/lists/people/12345
GET /api/lists/people/12345?select=name,age
GET /api/lists/people/12345?populate=friends
```

__Returns__

If the item was found:

```js
{
  "error": false,
  "message": "Item found!",
  "data": {
    "name": "Ryan",
    /*...*/
  }
}
```

If no items were found:

```js
{
  "error": false,
  "message": "Could not find that item.",
  "data": null
}
```



### Create
> __`POST`__ `/api/lists/:name`

Create a new, unpublished item in the specified list.

The item should be provided in the body of the `POST` request.

__Note:__ Requires a user token.

__Example__

```js
{
  "name": "Ryan",
  "age": 24
}
```

__Returns__

If the item was successfully created:

```js
{
  "error": false,
  "message": "Item created!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 24,
    "jangle": { "version": 1, /*...*/ }
  }
}
```

If the item could not be created:

```js
{
  "error": true,
  "message": "Missing required fields: name.",
  "data": null
}
```



### Update
> __`PUT`__ `/api/lists/:name/:id`

Update an existing item in the specified list.

The full item should be provided in the body of the `PUT` request.

__Note:__ Requires a user token.

__Example__

```js
{
  "name": "Ryan",
  "age": 25
}
```

__Returns__

If the item was successfully updated:

```js
{
  "error": false,
  "message": "Item updated!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 25,
    "jangle": { "version": 2, /*...*/ }
  }
}
```

If the item could not be updated:

```js
{
  "error": true,
  "message": "Missing required fields: age.",
  "data": null
}
```



### Patch
> __`PATCH`__ `/api/lists/:name/:id`

_Partially update_ an existing item in the specified list.

Only the updated fields should be provided in the body of the `PATCH` request.

__Note:__ Requires a user token.

__Example__

```js
{
  "age": 26
}
```

__Returns__

If the item was successfully updated:

```js
{
  "error": false,
  "message": "Item updated!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 26,
    "jangle": { "version": 3, ... }
  }
}
```

If the item could not be updated:

```js
{
  "error": true,
  "message": "age must be a number.",
  "data": null
}
```



### Remove
> __`DELETE`__ `/api/lists/:name/:id`

Remove an existing item in the specified list.

The item can be recovered later, this just removes it from our list.

__Note:__ Requires a user token.

__Example__

```
DELETE /api/lists/people/12345
```

__Returns__

If the item was successfully removed:

```js
{
  "error": false,
  "message": "Item removed!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 26,
    "jangle": { "version": 3, /*...*/ }
  }
}
```

If the item could not be created:

```js
{
  "error": true,
  "message": "age must be a number.",
  "data": null
}
```



### Restore
> __`PUT`__ `/api/lists/:name/:id/restore`

Restores an existing item that was deleted, from the specified list.

__Note:__ Requires a user token.

__Returns__

If the item was successfully restored:

```js
{
  "error": false,
  "message": "Item restored!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 26,
    "jangle": { "version": 5, ... }
  }
}
```

If the item could not be restored:

```js
{
  "error": true,
  "message": "Could not find item.",
  "data": null
}
```



### History
> __`GET`__ `/api/lists/:name/:id/history`

Shows the history of an existing item from the specified list.

__Note:__ Requires a user token.

__Example__

```
GET /api/lists/people/12345/history
```

__Returns__

If the item was found:

```js
{
  "error": false,
  "message": "Found the item's history.",
  "data": [
    { /*...*/ },
    { /*...*/ },
    { /*...*/ },
    { /*...*/ }
  ]
}
```

If the item could not be found:

```js
{
  "error": true,
  "message": "Could not find item.",
  "data": null
}
```



### Preview Rollback
> __`GET`__ `/api/lists/:name/:id/preview/:version`

Preview the rollback of an existing item to a previous version.

__Note:__ Requires a user token.

__Example__

```
GET /api/lists/people/12345/preview/2
```

__Returns__

If the version was found:

```js
{
  "error": false,
  "message": "Previewing rollback!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 25,
    "jangle": { "version": 2, /*...*/ }
  }
}
```

If the item's rollback could not be previewed:

```js
{
  "error": true,
  "message": "Could not find version 100.",
  "data": null
}
```



### Rollback
> __`POST`__ `/api/lists/:name/:id/rollback/:version`

Rollback an existing item to a previous version.

__Note:__ Requires a user token.

__Example__

```
POST /api/lists/people/12345/rollback/2
```

__Returns__

If the version was successfully rolled back:

```js
{
  "error": false,
  "message": "Person rolled back successfully!",
  "data": {
    "_id": 12345,
    "name": "Ryan",
    "age": 25,
    "jangle": { "version": 2, /*...*/ }
  }
}
```

If the item could not be rolled back:

```js
{
  "error": true,
  "message": "Could not find version 100.",
  "data": null
}
```



### Publish
> __`POST`__ `/api/lists/:name/:id/publish`

Publish an existing item.

__Note:__ Requires a user token.

__Example__

```
POST /api/lists/people/12345/publish
```

__Returns__

If the item was successfully published:

```js
{
  "error": false,
  "message": "Person published successfully!",
  "data": {
    "name": "Ryan",
    "age": 25
  }
}
```

If the item could not be published:

```js
{
  "error": true,
  "message": "Could not find item.",
  "data": null
}
```



### Unpublish
> __`POST`__ `/api/lists/:name/:id/unpublish`

Unpublish an existing item.

__Note:__ Requires a user token.

__Example__

```
POST /api/lists/people/12345/unpublish
```

__Returns__

If the item was successfully unpublished:

```js
{
  "error": false,
  "message": "Person unpublished successfully!",
  "data": {
    "name": "Ryan",
    "age": 25
  }
}
```

If the item could not be unpublished:

```js
{
  "error": true,
  "message": "Could not find item.",
  "data": null
}
```



### Is Live
> __`GET`__ `/api/lists/:name/:id/is-live`

Determine if an item is currently published.

__Example__

```
GET /api/lists/people/12345/is-live
```

__Returns__

If the item is published:

```js
{
  "error": false,
  "message": "Person is published.",
  "data": true
}
```

If the item is not published:

```js
{
  "error": false,
  "message": "Person is not published.",
  "data": false
}
```

If the item could not be found:

```js
{
  "error": true,
  "message": "Could not find item.",
  "data": null
}
```



### Schema
> __`GET`__ `/api/lists/:name/schema`

Get information about a list's structure and options.

Useful for rolling your own CMS.

__Example__

```
GET /api/lists/people/schema
```

__Returns__

If the list exists:

```js
{
  "error": false,
  "message": "Schema found.",
  "data": {
    "name": "Person",
    "slug": "people",
    "labels": {
      "singular": "Person",
      "plural": "People"
    },
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "String",
        "default": "",
        "required": true
      },
      {
        "name": "age",
        "label": "Age",
        "type": "Number",
        "default": "",
        "required": true
      },
      {
        "name": "friend",
        "label": "Friend",
        "type": "ObjectId",
        "ref": "Person",
        "default": "",
        "required": true
      }
    ]
  }
}
```

If the list could not be found:

```js
{
  "error": true,
  "message": "List not found.",
  "data": null
}
```