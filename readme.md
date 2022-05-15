# TodoMVC App Written in Vanilla JS in 2022 - Annotated

This is my copy of [1Marc/todomvc-vanillajs-2022](https://github.com/1Marc/todomvc-vanillajs-2022) by  Marc Grabanski, with a bunch of extra comments that I added as I read through the code to figure out how it works.

Most of the commentary is in [js/app.js](js/app.js)

Things I found interesting about this code:

- It listens to `window.addEventListener("hashchange", () => {` and then implements filter toggles as plain `<a href="#/active">Active</a>` links with no event handlers
- `TodoStore = class extends EventTarget {` then `TodoStore` uses `this.dispatchEvent(new CustomEvent('save'));` on changes and the app uses `Todos.addEventListener("save", App.render);` to re-render when something changes

BUT it turns out I was looking at the wrong code! Marc's [app-architecture](https://github.com/1Marc/todomvc-vanillajs-2022/tree/app-architecture/) branch is much more interesting. Here's [the commit](https://github.com/1Marc/todomvc-vanillajs-2022/commit/524d6d51ded39aa5b01dbd16e69822b719092dbb) with the most relevant changes compared to the code that I've annotated here.

## License

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by/4.0/80x15.png" /></a><br />This <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/InteractiveResource" rel="dct:type">work</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://sindresorhus.com" property="cc:attributionName" rel="cc:attributionURL">TasteJS</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/deed.en_US">Creative Commons Attribution 4.0 International License</a>.
