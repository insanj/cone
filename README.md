# cone

🍦 vanilla js static pwa generator, built in ts for [Oogy: Can You Help](https://oogycanyouhelp.com).

Does not require any dependencies (uses Typescript interally to generate `Cone.js`).

Wraps all DOM/browser methods and classes so 🍦 cone generates to a string consistently in every environment.

Why? For fun! I thought a completely in-house static website generator would be a good thing to maintain using current ECMAScript standards for my current projects, as well as a demo of some of the techniques from [Oogy: Can You Help](https://oogycanyouhelp.com) itself.

## Install

In Browser, download `dist/` and place the `Cone.js` somewhere in your website.

```html
<script src="Cone.js"></script>
```

In NodeJS, as simple as:

```bash
npm install oogy-cone
```

Then in any environment:

```ts
import { Cone } from "Cone.js"; // or 'oogy-cone'

const template = {
  // 🍦 .cone template
};

// -> or alternatively, in NodeJS contexts:
// import fs from 'fs';
// const data = fs.readFileSync('example.cone', 'utf8');
// -> just as in browser, you could import a data file from somewhere using <script>

const website = Cone.ConeBuilder.build({
  template,
});
```

> NOTE: see [tsconfig.json](tsconfig.json) to configure anything about the build process.

## Usage

In Browser:

```html
<script>
  const website = Cone.ConeBuilder.build({
    template: {
      // 🍦 .cone template goes here
    },
  });

  document.body.innerHTML += website;
</script>
```

In Express:

```ts
const app = express();
app.use("/", (req, res) => {
  const template = fs.readFileSync("example.cone", "utf8");
  const website = Cone.ConeBuilder.build({
    template,
  });
  res.set("Content-Type", "text/html");
  res.send(website);
});
```

[See example/ for a tiny example of using 🍦 cone with Express to serve a website using an `example.cone` file](example/)

## .cone

### example

```js
{
  /* content tabs */
  "tabs": [
    {
      /* title of this tab */
      "title": "🍦 cone example",

      /* content/"body" of this tab */
      "content": {
        /* style, which will help the elements look nice */
        "style": "jumbotron",

        /* list of elements we want to show in this tab */
        "elements": [
          {
            /* this is an image type */
            "type": "img",

            /* here is the image src attribute, which can be any URL that works from where the site is hosted */
            "src": "/png/jumbotron.png"
          },
          {
            /* h1 header type, all normal HTML types are used, and inline styles so its easy to customize after generating as well */
            "type": "h1",

            /* we'll want to fill in the text for the title elements instead of the `src` attribute */
            "text": "Oogy: Can You Help"
          },
          {
            /* finally, a p element which works as a subtitle in this case on the jumbotron style */
            "type": "p",
            "text": "Indie narrative deckbuilder."
          }
        ]
      }
    }
  ]
}
```

## Author

```
Julian @insanj Weiss
github.com/insanj
(c) 2022
```

## License

```
MIT License

Copyright (c) 2022 Julian Weiss

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
