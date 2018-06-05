<template lang="pug">
  div.homepage
    .hero
      .hero_content.container
        h1.hero__title Jangle
        h2.hero__subtitle a cms for humans.
        .hero__buttons.button__row
          span( v-fadable="300" )
            button.button.button--coral Get started
          span( v-fadable="600" )
            button.button Learn more
</template>

<script>
import Vue from "vue";
Vue.directive("fadable", {
  bind(el, { value = 300 } = {}) {
    el.classList.add("fadable");
    setTimeout(() => el.classList.add("fadable--ready"), value);
  }
});
export default {
  data: () => ({})
};
</script>


<style lang="scss">
$colors__coral: #f74;
$colors__green: #0b8;
$colors__red: #f66;
$colors__white: #fff;
$colors__jet: #242e27;

html,
body,
#app,
.theme-container,
.custom-layout,
.homepage {
  height: 100%;
  box-sizing: border-box;
}

.homepage {
  background-color: #f4f0f0;
  color: $colors__jet;
  line-height: 1;
  font-family: "Source Sans Pro", sans-serif;

  /* http://meyerweb.com/eric/tools/css/reset/ 
    v2.0 | 20110126
    License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  // Hero
  .hero {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 6rem 0;
    box-sizing: border-box;
    font-size: .75rem;

    &--full-height {
      min-height: 75%;
    }
    &__title {
      margin: 0;
      padding: 0;
  line-height: 1;
      font-weight: 600;
      font-size: 7em;
    }
    &__subtitle {
      margin: 0;
      padding: 0;
  line-height: 1;
      font-size: 2em;
      margin-top: 0.5em;
    }
    &__buttons {
      margin-top: 2rem;
    }
  }

  // Container
  .container {
    max-width: 720px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  // Button
  .button {
    font-family: inherit;
    font-size: 18px;
    font-weight: 600;
    padding: 0.5em 1.5em;
    border: solid 1px;
    border-radius: 4px;
    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;

    background-color: $colors__white;
    border-color: darken($colors__white, 5);
    color: $colors__coral;

    &:not(.button--loading):not(.button--disabled) {
      box-shadow: 0 2px 8px rgba(#000, 0.35);
      &:hover,
      &:focus {
        transform: translateY(-2px);
        box-shadow: 0 0.25em 0.75em rgba(#000, 0.35);
      }
    }

    &--loading,
    &--disabled {
      opacity: 0.75;
      cursor: default;
    }

    &--coral {
      background-color: $colors__coral;
      border-color: darken($colors__coral, 2.5);
      color: $colors__white;
    }

    &--green {
      background-color: $colors__green;
      border-color: darken($colors__green, 2.5);
      color: $colors__white;
    }

    &--red {
      background-color: $colors__red;
      border-color: darken($colors__red, 2.5);
      color: $colors__white;
    }

    &--loading {
      position: relative;

      &::before {
        content: "";
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: inherit;
      }

      &::after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin-top: -10px;
        margin-left: -10px;
        border-radius: 50%;
        border: 2px solid rgba($colors__coral, 0.25);
        border-top-color: $colors__coral;
        @keyframes spinner {
          to {
            transform: rotate(360deg);
          }
        }
        animation: spinner 0.6s linear infinite;
        line-height: 1;
      }

      &.button--coral,
      &.button--green,
      &.button--red {
        &::after {
          border: 2px solid rgba($colors__white, 0.25);
          border-top-color: $colors__white;
        }
      }
    }

    &__row {
      display: inline-flex;
      > *:not(:first-child) {
        margin-left: 1rem;
      }
    }
  }

  // Fadable
  .fadable {
    transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out,
      transform 0.6s ease-in-out;
    transform: translateY(8px);
    opacity: 0;
    visibility: hidden;
    &--ready {
      transform: none;
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>

