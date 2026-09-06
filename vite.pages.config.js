import { mergeConfig } from "vite";
import baseConfig from "./vite.config.js";

/**
 * Конфигурация сборки для GitHub Pages.
 * base: "./" делает пути к ассетам относительными, поэтому сайт
 * корректно работает по адресу https://username.github.io/repo-name/
 *
 * Сборка:  npx vite build --config vite.pages.config.js
 */
export default mergeConfig(baseConfig, {
  base: "./",
});
