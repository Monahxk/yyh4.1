<script>
import 'fullcalendar/dist/fullcalendar.min.css'
import 'fullcalendar-scheduler/dist/scheduler.min.css'
import 'fullcalendar'
import 'fullcalendar-scheduler'
import $ from 'jquery'
import _ from 'lodash'

export default {
  name: 'VueFullcalendar',
  props: {
    options: {
      type: Object,
      default () {
        return {
        }
      }
    },
    header: {
      type: Object,
      default () {
        return {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        }
      }
    },
    resources: {
      type: Array,
      default () {
        return []
      }
    },
    events: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      calendar: null,
      instance: null,
      currentOptions: this.options
    }
  },
  computed: {
    defaultOptions () {
      const self = this
      return {
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        locale: 'zh-cn',
        editable: true,
        selectable: true,
        droppable: true,
        viewRender (...args) {
          self.$emit('viewRender', ...args)
        },
        viewDestroy (...args) {
          self.$emit('viewDestroy', ...args)
        },
        eventDragStart (...args) {
          self.$emit('eventDragStart', ...args)
        },
        eventDragStop (...args) {
          self.$emit('eventDragStop', ...args)
        },
        eventDrop (...args) {
          self.$emit('eventDrop', ...args)
        },
        drop (...args) {
          let removeElement = _.isUndefined(self.currentOptions.deleteDroppableElement) ? true : self.currentOptions.deleteDroppableElement
          if (removeElement) {
            $(this).remove()
          }
          self.$emit('drop', ...args)
        },
        eventReceive (event) {
          self.$emit('eventReceive', event)
        },
        select(...args) {
          self.$emit('select', ...args)
        },
        eventResizeStart (...args) {
          self.$emit('eventResizeStart', ...args)
        },
        eventResizeStop (...args) {
          self.$emit('eventResizeStop', ...args)
        },
        eventResize (...args) {
          self.$emit('eventResize', ...args)
        },
        eventClick (...args) {
          self.$emit('eventClick', ...args)
        },
        eventMouseover (...args) {
          self.$emit('eventMouseover', ...args)
        },
        eventMouseout (...args) {
          self.$emit('eventMouseout', ...args)
        },
        eventAfterRender (...args) {
          self.$emit('eventAfterRender', ...args)
        },
        eventAfterAllRender (...args) {
          self.$emit('eventAfterAllRender', ...args)
        },
        eventRender (...args) {
          self.$emit('eventRender', ...args)
        },
        eventDestroy (...args) {
          self.$emit('eventDestroy', ...args)
        },
        resourceRender (...args) {
          self.$emit('resourceRender', ...args)
        }
      }
    }
  },
  created: function () {
  },
  mounted: function () {
    this.$nextTick(function () {
      this.renderCalendar()
    })
  },
  beforeDestroy () {
    this.calendar = null
    this.instance = null
  },
  watch: {
    'options': {
      deep: true,
      handler (val) {
        this.changeOptions()
      }
    },
    'resources': {
      deep: true,
      handler (val) {
        this.changeResources()
      }
    },
    'events': {
      deep: true,
      handler (val) {
        this.changeEvents()
      }
    }
  },
  methods: {
    getInstance () {
      return this.instance
    },
    changeEvents () {
      let self = this
      if (self.calendar) {
        $(this.$el).fullCalendar('removeEvents')
        $(this.$el).fullCalendar('addEventSource', self.events)
      } else {
        self.renderCalendar()
      }
    },
    changeResources () {
      this.renderCalendar()
    },
    changeOptions () {
      let self = this
      self.currentOptions = _.defaultsDeep(self.options, self.currentOptions, self.defaultOptions)
      let options = _.cloneDeep(self.currentOptions)
      if (self.calendar) {
        $(self.$el).fullCalendar('option', options)
      } else {
        self.renderCalendar()
      }
    },
    renderCalendar () {
      let self = this
      self.currentOptions = _.defaultsDeep(self.options, self.currentOptions, self.defaultOptions)
      let options = _.cloneDeep(self.currentOptions)
      if (self.calendar) {
        $(self.$el).fullCalendar('destroy')
      }
      if (self.resources && self.resources.length > 0) {
        options.resources = _.cloneDeep(self.resources)
      }
      if (self.events && self.events.length > 0) {
        options.events = _.cloneDeep(self.events)
      }
      self.calendar = $(self.$el).fullCalendar(options)
      self.instance = $(self.$el).fullCalendar('getCalendar')
    }
  }
}
</script>

<template>
  <div ref="vf"></div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
