class Watcher{
  constructor(vm, prop, callback){
    this.vm = vm;
    this.prop = prop;
    this.callback = callback;
    this.value = this.get();
  }
  update(){
    const value = this.vm.$data[this.prop];
    const oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.callback(value);
    }
  }
  get(){
    Dep.target = this; //储存订阅器
    const value = this.vm.$data[this.prop]; //因为属性被监听，这一步会执行监听器里的 get方法
    Dep.target = null;
    return value;
  }
}