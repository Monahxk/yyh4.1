export const price = {
  inserted(el, binding, vnode) {
    let {value} = binding
    console.log( el )
    console.log( binding )
    console.log( value )
  }
}