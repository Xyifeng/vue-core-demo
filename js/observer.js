function observer(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  for (let key in data) {
    defineReactive(data, key, data[key]);
  }
}

function defineReactive(data, key, value) {
  //递归调用，监听所有属性
  observer(value);
  const dep = new Dep();
  Object.defineProperty(data, key, {
    get(){
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set(newVal){
      if (value !== newVal) {
        value = newVal;
        dep.notify(); //通知订阅器
      }
    }
  });
}

// 容器
class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    })
  }
}
// es6 class只能以此添加公共方法属性
Dep.prototype.target=null