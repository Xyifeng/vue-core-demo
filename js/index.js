class Vue {
  constructor(options) {
    this.$el = document.querySelector(options.el);
    this.$data = options.data;
    Object.keys(this.$data).forEach(key => {
      this.proxyData(key);
    });
    this.init(this.$data);
  }
  init() {
    // 加入观察者
    observer(this.$data);
    // 编译器
    new Compile(this);
  }
  // 数据劫持 重写get set 让数据直接读取写入
  proxyData(key) {
    Object.defineProperty(this, key, {
      get(){
        return this.$data[key]
      },
      set(value){
        this.$data[key] = value;
      }
    });
  }
}