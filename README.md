# Gulp-задачи

Префикс gulp (например: gulp build)

* `default` — основная задача, запускает `build`, `watch` и `serve`.
* `build` — сборка всех файлов, запускает задачи `copy`, `images`, `sprites:png`, `sprites:svg`, `pug`, `scss`, `js`.
* `watch` — запускает слежение за файлами, так что при изменении они автоматически пересобираются.
* `serve` — запускает сервер Browsersync.
* `pug` — запускает сборку Pug-шаблонов.
* `images` — запускает сборку изображений.
* `sprites:png` — запускает генерацию PNG-спрайтов.
* `sprites:svg` — запускает генерацию SVG-спрайтов.
* `scss` — запускает сборку стилей.
* `js` — запускает сборку скриптов.
* `copy` — запускает сборку дополнительных ресурсов.
* `lint` — последовательно запускает линтеры `lint:js`, `lint:pug`, `lint:scss`.
* `lint:js` — проверяет JavaScript-файлы линтером [ESLint](http://eslint.org/).
* `lint:pug` — проверяет Pug-файлы линтером [pug-lint](https://github.com/pugjs/pug-lint).
* `lint:scss` — проверяет SCSS-файлы линтером [stylelint](https://stylelint.io/).
* `optimize:svg` — оптимизирует и форматирует код SVG-файлов в папке `src/images`.
* `optimize:images` — оптимизирует изображения в папке `src/images`.
* `zip` — создает архив проекта.