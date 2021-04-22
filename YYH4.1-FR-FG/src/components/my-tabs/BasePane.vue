<template>
  <div class="pane_wrapper" v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'pane',
  components: {},
  props: {
    name: {
      type: String
    },
    label: {
      type: String,
      default: '',
      required: true
    },
    navData: {
      type: Array
    }
  },
  data () {
    return {
      show: false,
      names: this.name,
      labels: this.label,
      nums: this.num
    }
  },
  watch: {
    labels() {
      this.updateNav()
    },
    names(v) {
      this.updateNav()
    }
  },
  computed: {},
  methods: {
    updateNav() {
      this.$parent.updateNav()
    }
  },
  mixins: [],
  mounted () {
    this.updateNav()
  }
}
</script>
<style lang="less" scoped>
.pane_wrapper{
  width: 100%;
}
</style>