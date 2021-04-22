<template>
</template>

<script>
import vuescroll from "vuescroll";
export default {
  components: { vuescroll },
  props: ['dialogVisible'],
  data() {
    return {
      ops: {
        mode: "native",
        sizeStrategy: "percent",
        detectResize: true,
        bar: {
          background: "#F0F0F0",
          keepShow: false,
          size: "6px",
          minSize: 0.2
        }
      }
    };
  },
  watch: {},
  computed: {},
  methods: {},
  mixins: [],
  mounted() {}
};
</script>