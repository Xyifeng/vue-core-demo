class Compile {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.$el;
    this.init()
  }
  init() {
    this.fragment = this.nodeFragment(this.el);
    this.compileNode(this.fragment);
    this.el.appendChild(this.fragment);
  }
  nodeFragment(el) {
    // 创建内存中的DOM
    const fragment = document.createDocumentFragment();
    let child = el.firstChild;
    //将子节点，全部移动文档片段里
    while (child) {
      fragment.appendChild(child);
      child = el.firstChild;
    }
    return fragment;
  }
  // 编译节点
  compileNode(fragment) {
    const childNodes = fragment.childNodes;
    [...childNodes].forEach(node => {
      // 如果节点是元素节点，则 nodeType 属性将返回 1。
      // 如果节点是属性节点，则 nodeType 属性将返回 2。
      // ......
      // 参照https://www.w3school.com.cn/jsref/prop_node_nodetype.asp
      if (this.isElementNode(node)) {
        this.compile(node);
      }

      const reg = /\{\{(.*)\}\}/;
      const text = node.textContent;
      if (reg.test(text)) {
        const prop = reg.exec(text)[1];
        this.compileText(node, prop); //替换模板
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileNode(node);
      }
    })
  }
  compile(node) {
    // 编译vue的指令
    let nodeAttrs = node.attributes;
    [...nodeAttrs].forEach(attr => {
      let { name, value } = attr;
      if (name === "v-model") {
        this.compileModel(node, value);
      }
    });
  }
  compileModel(node, prop) {
    let val = this.vm.$data[prop];
    // 初始化值
    this.updateModel(node, val);
    // 添加观察者
    new Watcher(this.vm, prop, (value) => {
      // 回调函数
      this.updateModel(node, value);
    });

    node.addEventListener('input', e => {
      let newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      this.vm.$data[prop] = newValue;
    });
  }
  compileText(node,prop){
    let text = this.vm.$data[prop];
    this.updateView(node, text);
    new Watcher(this.vm, prop, (value) => {
      this.updateView(node, value);
    });
  }
  updateModel(node,value){
    node.value = typeof value === 'undefined' ? '' : value;
  }
  updateView(node,value){
    node.textContent = typeof value === 'undefined' ? '' : value;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
}