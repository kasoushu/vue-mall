<template>
    <a-row :gutter="32" style="margin-top: 35px;">
        <a-col :span="8">
            <a-statistic  title="订单总数" :value="statistic.order_total" style="background-color: #ececec;padding: 25px">
                <template #prefix>
                    <file-text-two-tone  />
                </template>
            </a-statistic>
        </a-col>
        <a-col :span="8">
            <a-statistic title="今日订单数" :value="statistic.day_total" style="background-color: #ececec;padding: 25px" class="demo-class">
                <template #prefix>
                    <file-text-two-tone two-tone-color="#d494aa" />
                </template>
            </a-statistic>
        </a-col>
    
        <a-col :span="8">
            <a-statistic title="本月订单数" :value="statistic.month_total" style="background-color: #ececec;padding: 25px" class="demo-class">
                <template #prefix>
                    <file-text-two-tone two-tone-color="#50676b" />
                </template>
            </a-statistic>
        </a-col>
    </a-row>
    <a-row type="flex" justify="start" :gutter="16" style="padding:15px; margin-top: 20px;background-color: #ececec">

        
         <a-col :span="5" >
             <a-card title="本月订单" :bordered="false" style="width: 250px">
                 <a-card>
                     <a-statistic
                     title="未完成"
                     :value="statistic.month_not_done"
                     :value-style="{ color: '#3f8600' }"
                     >
                         <template #prefix>
                             <arrow-up-outlined/>
                         </template>
                     </a-statistic>
                 </a-card>
                 <a-card style="margin-top: 50px">
            
                     <a-statistic
                     title="已完成"
                     :value="statistic.month_done"
                     :value-style="{ color: '#3f8600' }"
                     >
                         <template #prefix>
                             <arrow-up-outlined/>
                         </template>
                     </a-statistic>
                 </a-card>
                 <a-card
                 style="margin-top: 50px"
                 >
                     <p>统计于{{ time.toLocaleString() }}</p>
                 </a-card>
             </a-card>
        </a-col>
    
        <a-col :span="5">
            <a-card title="今日订单" :bordered="false" style="width: 250px;" >
            
                <a-card>
                    <a-statistic
                    title="未完成"
                    :value="statistic.day_not_done"
                    :value-style="{ color: '#3f8600' }"
                    style="margin-right: 50px;"
                    >
                        <template #prefix>
                            <arrow-up-outlined/>
                        </template>
                    </a-statistic>
                </a-card>
                <a-card style="margin-top: 50px">
                
                    <a-statistic
                    title="已完成"
                    :value="statistic.day_done"
                    :value-style="{ color: '#3f8600' }"
                    >
                        <template #prefix>
                            <arrow-up-outlined/>
                        </template>
                    </a-statistic>
                </a-card>
                <a-card
                style="margin-top: 50px"
                >
                    <p>统计于{{time.toLocaleString()}}</p>
                </a-card>
            </a-card>
    
        </a-col>
        <a-col :span="14">
            <a-row type="flex" justify="center">
                <p style="font-size: xx-large">十天内订单统计</p>
            </a-row>
            <a-row type="flex" justify="center" >
                <Chart
                :data="list"
                :margin="margin"
                :direction="direction"
                >
                    <template #layers>
                        <Grid strokeDasharray="2,2" />
                        <Line :dataKeys="['day', 'cnt']" />
<!--                        <Line :dataKeys="['name', 'avg']" :lineStyle="{ stroke: 'red' }" type="step" />-->
<!--                        <Line :dataKeys="['name', 'inc']" :lineStyle="{ stroke: 'red' }"  />-->
                    </template>
    
                </Chart>
            </a-row>
            
        </a-col>
    </a-row>
</template>
<script>
import {LikeOutlined} from '@ant-design/icons-vue';
import request from "@/utils/request";
import router from "@/router";
import store from "@/store";
import {ContainerOutlined,FileTextTwoTone} from "@ant-design/icons-vue";
import { Chart, Grid, Line } from 'vue3-charts'
import {ref} from "vue";
export default {
    name: 'OrderInfo',
    data() {
        return {
            productByStatus: [],
        
        }
    },
    created() {
    
    },
    components: {
        LikeOutlined,
        ContainerOutlined,
        FileTextTwoTone,
        Chart,Grid,Line
    },
    setup() {
    
        let statistic= ref({})
        let list = ref([])
        request({
            url: '/admin/order_statistic',
            method: 'get',
        }).then(
        res => {
            console.log(res)
            if (res.data.code === 401) {
                store.commit('cleanToken')
                alert("your token is unavailable ")
                router.push("/admin_login")
                console.log(res.data.message)
            } else if (res.data.code === 200) {
                statistic.value = res.data.data
            } else {
                console.log(res.data.message)
            }
        }
        ).catch(
        err => console.log(err)
        )
    
        // list graph
        request({
            url: '/admin/ten_days_order_count',
            method: 'get',
        }).then(
        res => {
            console.log(res)
            if (res.data.code === 401) {
                store.commit('cleanToken')
                alert("your token is unavailable ")
                router.push("/admin_login")
                console.log(res.data.message)
            } else if (res.data.code === 200) {
                list.value = res.data.data
            } else {
                console.log(res.data.message)
            }
        }
        ).catch(
        err => console.log(err)
        )
        
        const time = new Date()
        const direction = ref('horizontal')
        const margin = ref({
            left: 0,
            top: 20,
            right: 20,
            bottom: 0
        })
        
        return {
            statistic,
            list,
            time,
            direction,
            margin
        }
    },
    computed: {
        
        getPer() {
            return (status) => {
                let m = new Map()
                for (let v of this.productByStatus) {
                    m[v.status] = v.total
                }
                return parseInt(m[status] * 100 / this.productTotal)
            }
        },
        getTotal() {
            return (status) => {
                let m = new Map()
                for (let v of this.productByStatus) {
                    m[v.status] = v.total
                }
                return m[status]
            }
        }
        
    },
};
</script>


<style scoped>

/*.row-1{*/
/*    width: 100%;*/
/*    margin-left: 30px;*/
/*}*/
</style>
