# familymart-mobile-stack

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


https://fm-1221-mobile-dev.parramountain.com
http://localhost:8081/itinerary-manage/index?username=81011103&password=wqrwe

###  模块入口地址：
* 工作台： /workbench
* 任务管理：  /management-task/index
* 审批列表：/task-Approval/ApproveList
* 统计报表： /statistical-report/statistical-report
* 访店任务： /perform-task/visit-store
* 其他任务/改善任务： /perform-task/else-task
* 创建任务： /create-task

### 主任务 子任务状态机
* 主任务 包含三种状态: 未开始 、 进行中 、已完成
* 子任务 在执行提交时不考虑主任务状态
  * 一旦子任务被其领导 进行 结案操作后 该子任务不能进行提交操作
  * 非结案状态下 非领导角色 都可以进行子任务提交操作
