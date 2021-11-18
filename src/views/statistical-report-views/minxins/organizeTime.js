// 头部筛选组件
import organzieAndTime from "../components/organzieAndTime";
import moment from 'moment';
const organizeTime = {
    components: {
        organzieAndTime
    },
    data() {
        return {
            // 当前选择时间
            currentDate: {
                startTime: '',
                endTime: ''
            },
            // 筛选框 显示控制
            filterStatus: true,
            // 门店详细部分 显示控制
            storeStatus: false,
            // 当前 选中的组织或担当
            currentExecutor: '',
            returnStatus: false
        }
    },
    mounted() {
        this.defaultTime()
    },
    methods:{
        leftStatus() {
            this.returnStatus = true
        },
        onClickLeft() {
            this.$notice.$emit('getOrganizeLevel')
        },
        // 默认时间
        defaultTime() {
            this.currentDate.startTime = moment().startOf('month').format('YYYY-MM-DD')
            this.currentDate.endTime = moment().endOf('month').format('YYYY-MM-DD')
        },
        // 开启 时间选择弹层
        openTimePopup() {
            this.$refs.organizeChild.switchTimePopup()
        },
        // 时间 change
        changeTime(startTime, endTime) {
            this.currentDate.startTime = moment(startTime).format('YYYY-MM-DD')
            this.currentDate.endTime = moment(endTime).format('YYYY-MM-DD')
            this.getRouteInfo()
        },
        // 开启执行人
        openExecutor() {
            this.$refs.organizeChild.handleCellSelectApprove()
            this.filterStatus = !this.filterStatus
        },
        // 执行人 change
        changeExecutor(data) {
            this.$notice.$emit('navigation', { title: '访店记录' });
            this.currentExecutor = data
            this.filterStatus = true
            this.getRouteInfo()
        }
    }
}
export default organizeTime
