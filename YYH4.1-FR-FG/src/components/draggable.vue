<script>
import 'jquery-ui-dist/jquery-ui.min'
import $ from 'jquery'
import _ from 'lodash'
export default {
  name: 'VueDraggable',
  props: {
    options: {
      type: Object,
      default () {
        return {
        }
      }
    },
    event: {
      type: Object,
      default () {
        return {
        }
      }
    }
  },
  computed: {
    defaultOptions () {
      return {
        revert: true,
        revertDuration: 0
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.renderDraggable()
    })
  },
  watch: {
    'event': {
      deep: true,
      handler (val) {
        $(this.$el).data('event', val)
      }
    }
  },
  methods: {
    renderDraggable: function () {
      let options = _.defaultsDeep(this.options, this.defaultOptions)
      $(this.$el).draggable(options)
      $(this.$el).data('event', this.event)
    }
  }
}
</script>

<template>
  <div ref="vf" style="cursor: pointer;">
    <slot></slot>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>