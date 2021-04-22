import sse from "sessionstorage";
export default {
  provide() {
    return {
      "global_App": this
    }
  },
  data() {
    return {
      author: '勿动',

    }
  },
  methods: {
    findComponentsUpward(context, componentName, method) {
      console.log( this.$route )
      let r_name = componentName || this.$route.name
      let parent = context.$parent
      let name = parent.$options.name;
      
      while(parent && !name || [r_name].indexOf(name) < 0) {
        parent = parent.$parent
        if (parent) name = parent.$options.name
      }
      parent.updateConstData()
      // method? parent.method() : 
      return parent;
    }
  },
  created() {
    this.powerId = sse.getItem('powerId')
  }
}