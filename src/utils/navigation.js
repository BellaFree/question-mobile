function getSubtitle (vm) {
  const { subtitle } = vm.$options
  if (subtitle) {
    return typeof subtitle === 'function'
      ? subtitle.call(vm)
      : subtitle
  }
}

function getLeftIcon (vm) {
  const { leftIcon } = vm.$options
  if (leftIcon) {
    return typeof leftIcon === 'function'
      ? leftIcon.call(vm)
      : leftIcon
  }
}

function getLeftTitle (vm) {
  const { leftTitle } = vm.$options
  if (leftTitle) {
    return typeof leftTitle === 'function'
      ? leftTitle.call(vm)
      : leftTitle
  }
}

function getRightIcon (vm) {
  const { rightIcon } = vm.$options
  if (rightIcon) {
    return typeof rightIcon === 'function'
      ? rightIcon.call(vm)
      : rightIcon
  }
}

function getRightTitle (vm) {
  const { rightTitle } = vm.$options
  if (rightTitle) {
    return typeof rightTitle === 'function'
      ? rightTitle.call(vm)
      : rightTitle
  }
}

function getNavClass (vm) {
  const { navClass } = vm.$options
  if (navClass) {
    return typeof navClass === 'function'
      ? navClass.call(vm)
      : navClass
  }
}

function getNotice (vm) {
  let title = getSubtitle(vm)
  let leftIcon = getLeftIcon(vm)
  let leftTitle = getLeftTitle(vm)
  let rightIcon = getRightIcon(vm)
  let rightTitle = getRightTitle(vm)
  let navClass = getNavClass(vm)
  let {onLeft, onRight} = vm.$options

  if (title || leftIcon || rightIcon) {
    vm.$notice.$emit('navigation', {
      navClass,
      title,
      leftIcon,
      leftTitle,
      rightIcon,
      rightTitle,
      onLeft: function () { onLeft.call(vm) },
      onRight: function () { onRight.call(vm) }
    })
  }
}
const clientMixin = {
  created () {
    getNotice(this)
  }
}


export default clientMixin
