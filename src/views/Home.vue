<template lang="pug">
.home
  .landing
    .logo
      img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    .brand-name Polytope Solutions
    .slogan Gain Higher Perspectives
  .content(v-if="true")
    p Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet dictum sit amet justo donec enim diam vulputate ut. Blandit massa enim nec dui. Pretium lectus quam id leo in vitae turpis. Sit amet venenatis urna cursus eget nunc scelerisque. A diam maecenas sed enim. Sed odio morbi quis commodo odio aenean sed. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Fermentum odio eu feugiat pretium. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Risus nec feugiat in fermentum posuere. Venenatis lectus magna fringilla urna.

    p Tortor condimentum lacinia quis vel eros donec. Dolor sit amet consectetur adipiscing elit duis tristique. Ut tristique et egestas quis ipsum suspendisse ultrices gravida dictum. Orci dapibus ultrices in iaculis nunc sed augue. Leo vel fringilla est ullamcorper. Risus pretium quam vulputate dignissim. Et molestie ac feugiat sed lectus vestibulum mattis. Ultricies tristique nulla aliquet enim. Sed risus pretium quam vulputate dignissim suspendisse in est. Sed enim ut sem viverra aliquet eget. A lacus vestibulum sed arcu non odio euismod lacinia. Facilisi nullam vehicula ipsum a arcu cursus vitae.

    p Metus aliquam eleifend mi in. A condimentum vitae sapien pellentesque habitant morbi tristique. Tortor condimentum lacinia quis vel eros donec ac odio. Nulla porttitor massa id neque aliquam vestibulum morbi. Mattis enim ut tellus elementum sagittis vitae et leo. Imperdiet sed euismod nisi porta lorem mollis aliquam. Tempor commodo ullamcorper a lacus vestibulum. Eleifend donec pretium vulputate sapien nec sagittis aliquam. Sollicitudin nibh sit amet commodo nulla facilisi. Morbi blandit cursus risus at ultrices mi tempus. Lacus vel facilisis volutpat est velit egestas dui id. At elementum eu facilisis sed odio morbi. Pharetra et ultrices neque ornare aenean euismod. A arcu cursus vitae congue mauris rhoncus aenean vel elit. Amet commodo nulla facilisi nullam. In ante metus dictum at tempor.

    p Felis eget nunc lobortis mattis aliquam faucibus. Consectetur a erat nam at lectus urna duis convallis convallis. Habitasse platea dictumst quisque sagittis purus sit amet volutpat. Luctus accumsan tortor posuere ac ut consequat semper viverra nam. Leo duis ut diam quam nulla porttitor massa. Sit amet consectetur adipiscing elit. Scelerisque in dictum non consectetur a erat nam at. Placerat duis ultricies lacus sed turpis tincidunt. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Eu nisl nunc mi ipsum faucibus. Et egestas quis ipsum suspendisse ultrices gravida dictum.

    p Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio. Luctus accumsan tortor posuere ac. Nunc faucibus a pellentesque sit. Enim facilisis gravida neque convallis a cras semper auctor neque. A diam sollicitudin tempor id eu nisl nunc mi ipsum. Quam vulputate dignissim suspendisse in. Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Dictumst quisque sagittis purus sit amet volutpat consequat. Non pulvinar neque laoreet suspendisse. Sed euismod nisi porta lorem mollis aliquam. Accumsan in nisl nisi scelerisque eu ultrices vitae. Mattis pellentesque id nibh tortor id aliquet. Dictum sit amet justo donec enim. Sagittis aliquam malesuada bibendum arcu vitae. Nunc scelerisque viverra mauris in aliquam sem. Lectus sit amet est placerat in. Amet venenatis urna cursus eget nunc. At imperdiet dui accumsan sit.
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}
</script>

<style lang="sass">
.home
  .landing
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    .logo img
        filter: invert(100%)
        width: 40%
    .brand-name
      font-family: "Sirin Stencil", cursive
      font-size: 7rem
    .slogan
      font-size: 2.5rem
      margin: 2rem
  .content
    min-height: 100vh
    display: flex
    flex-direction: column
    justify-content: center
    p
      margin: 20px
</style>
