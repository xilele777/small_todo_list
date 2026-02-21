const form = document.querySelector('.form')
const input = document.querySelector('.input')
const item = document.querySelector('.item')
const sumElement = document.querySelector('.sum');
const doneElement = document.querySelector('.done');
const progressElement = document.querySelector('.progress');

//初始化任务列表（从localStorage读取，无数据则为空数组）
let taskList = JSON.parse(localStorage.getItem('todoTasks')) || [];

let sum = 0;
let done = 0;
let progress = 0;

//页面加载时先渲染本地存储的任务
renderTasks();

function updateCount() {
  sum = taskList.length;
  done = taskList.filter(task => task.isCompleted).length;
  progress = sum === 0 ? 0 : Math.round((done / sum) * 100);

  sumElement.textContent = sum;
  doneElement.textContent = done;
  progressElement.textContent = `${progress}%`;
}

// 渲染任务列表的函数
function renderTasks() {
  // 先清空现有列表，避免重复
  item.innerHTML = '';

  taskList.forEach((task, index) => {
    const display = document.createElement('li')
    display.className = 'display'
    // 给每个li标记索引，方便后续修改状态
    display.dataset.index = index;
    // 根据任务完成状态设置划线样式
    display.style.textDecoration = task.isCompleted ? 'line-through' : 'none';
    display.innerHTML = `<span class="task-text">${task.content}</span>`;

    //左键完成
    display.addEventListener('click', function () {
      const index = this.dataset.index;
      // 切换完成状态
      taskList[index].isCompleted = !taskList[index].isCompleted;
      // 更新样式
      this.style.textDecoration = taskList[index].isCompleted ? 'line-through' : 'none';
      // 保存到本地存储
      saveToLocal();
      // 更新统计
      updateCount();
    })

    // 右键删除
    display.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      const index = this.dataset.index;
      taskList.splice(index, 1); // 1. 改数据
      saveToLocal();             // 2. 存本地
      renderTasks();             // 3. 重新渲染整个列表
      // 注意：调用 renderTasks 后不需要再调用 updateCount，因为它内部包含了。也不需要 this.remove() 了。
    })

    item.appendChild(display);
  });

  // 渲染完成后更新统计
  updateCount();
}

//保存任务列表到localStorage
function saveToLocal() {
  localStorage.setItem('todoTasks', JSON.stringify(taskList));
}

// 表单提交添加任务
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = input.value.trim()
  if (!text) {
    alert('请输入有效值！')
    return
  }

  // 新增任务对象，添加到taskList
  const newTask = {
    content: text,
    isCompleted: false // 初始为未完成
  };
  taskList.push(newTask);
  // 保存到本地存储
  saveToLocal();
  // 重新渲染任务列表
  renderTasks();

  input.value = '';
  // 无需重复调用updateCount()，因为renderTasks()里已经调用了
});

// 初始化统计（页面加载时执行）
updateCount();