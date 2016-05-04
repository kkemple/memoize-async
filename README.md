# memoize-async

Async memoization

[![Code Climate](https://codeclimate.com/github/kkemple/memoize-async/badges/gpa.svg)](https://codeclimate.com/github/kkemple/memoize-async)
[![Test Coverage](https://codeclimate.com/github/kkemple/memoize-async/badges/coverage.svg)](https://codeclimate.com/github/kkemple/memoize-async)
[![Issue Count](https://codeclimate.com/github/kkemple/memoize-async/badges/issue_count.svg)](https://codeclimate.com/github/kkemple/memoize-async)
[![Circle CI](https://circleci.com/gh/kkemple/memoize-async.svg?style=svg)](https://circleci.com/gh/kkemple/memoize-async)

`npm install memoize-async`

## API

### memoize(fn: function [, resolver: function]): Promise

- **fn**: function to evaluate (can be async or sync)
- **resolver**: function used to generate a key from fn params, useful for complex memoization (can be async or sync)

> `memoize-async` expects the global `Promise` to be defined

___

## Examples

**Standard**:

```javascript
import memoize from 'memoize-async'
import { get } from 'highwire'
import { retry } from 'u-promised'

const fn = (url) =>
  retry(3, () =>
    get(url).then((response) =>
      JSON.parse(response.body)))

const memFetch = memoize(fn)

memFetch('http://some.api/things')
  .then((things) => console.log(things)) // must resolve from fn
  .then(() => memFetch('http://some.api/things'))
  .then((things) => console.log(things)) // resolves from cache

```

**With Resolver**:

```javascript
import memoize from 'memoize-async'
import { get } from 'highwire'
import { retry } from 'u-promised'

const fn = (user) =>
  retry(3, () =>
    get(user.profile).then((response) =>
      JSON.parse(response.body)))

const resolver = (user) => user.id

const memFetchUserProfile = memoize(fn, resolver)

const user = {
  id: '1234-5678'
  profile: 'http://some.api/users/1234-5678'
}

memFetch(user)
  .then((profile) => console.log(profile)) // sets cache key to '1234-5678'
  .then(() => memFetch(user))
  .then((profile) => console.log(profile)) // resolves from cache

```

**Clearing cache**:

```javascript
import memoize from 'memoize-async'
import { get } from 'highwire'
import { retry } from 'u-promised'

const fn = (url) =>
  retry(3, () =>
    get(url).then((response) =>
      JSON.parse(response.body)))

const memFetch = memoize(fn)

const CLEAR_TIMER = 1000 * 60 * 5

memFetch('http://some.api/things')
  .then((things) => console.log(things)) // must resolve from fn
  .then(() => setTimeout(() => memFetch.cache.clear(), CLEAR_TIMER))
```

___

## Testing
Run `npm test`. To also generate coverage run `npm run test:coverage`.
