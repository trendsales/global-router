# universal-router

The idea is to create a router, which should play well in all environments, both in a node, client and universal application.

## Usage

To create add routes, use the ```Route.add``` method, with the as a string. ```*``` matches anything while ```:params``` becomes parameters.
The second parameter can be anything. These will be returned as an array for all matched routes when resolving an URL

```javascript
var Router = require('universal-router').Router;

var router = new Router();
router.add('/user/*', 'route1');
router.add('/user/:id', 'route2');
router.add('/user/:id/*', 'route3');
router.add('/user/*/images', 'route4');
router.add('/user/:id/images', 'route5');
router.add('/user/:id/details', 'route6');
```

To find url matches ```resolve``` is called on the router instance, which will output all matched routes.

```javascript
router.resolve('/user/1234/images');
```

will output

```json
[
  {
    "state": {},
    "result": "route1"
  },
  {
    "state": {
      "id": "1234"
    },
    "result": "route2"
  },
  {
    "state": {
      "id": "1234"
    },
    "result": "route3"
  },
  {
    "state": {},
    "result": "route4"
  }
  {
    "state": {
      "id": "1234"
    },
    "result": "route5"
  },
]
```

### Processing responses

To change output, for instance to create a React tree from elements, a ```processResponse(current, previous)``` can be send to the router, which will loop through all routes, and feed the returned from previous call to the next call.

```javascript
var router = new Router({
  processResponse: function(current, previous) {
    if (previous) {
      return React.cloneElement(response, null, previous);
    } else {
      return current.result;
    }
  }
});

router.add('/user/*', <User />);
router.add('/user/:id', <Details />);

```

Using ```router.resolve('/user/1234')``` in the example above would then result in

```html
<User>
  <Details />
</User>
```
