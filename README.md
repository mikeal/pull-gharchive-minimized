# pull minimized gharchive data

```javascript
const pull = require('pull-gharchive-minimized')
const onehour = 1000 * 60 * 60
for await (const event of pull(Date.now() - (onehour * 50))) {
  console.log(event)
}
```


