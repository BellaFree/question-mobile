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
        }
    },
    mounted() {
        this.defaultTime()
    },
    methods:{
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
        }
    }
}
export default organizeTime
