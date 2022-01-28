<template>
    <a-row class="row-1" type="flex" justify="center" :gutter="[16,148]"  style="margin-left: 20px" >
        <a-col :span="12">
            <a-col :span="12">
                <a-statistic-countdown
                title="Token available time"
                :value="Date.now()+60*60*1000"
                format="HH:mm:ss"
                style="margin-right: 50px"
                />
            </a-col>
        </a-col>
        <a-col :span="12">
        
        </a-col>
    </a-row>
    <a-row  class="row-1" type="flex" justify="end" :gutter="[8,148]" style="margin-left: 20px">
        <a-col :span="10">
            <div style="background: #ececec; padding: 30px">
                <a-row :gutter="[16,128]">
                    <a-col :span="12">
                        <a-card>
                            <a-statistic
                            title="Feedback"
                            :value="114514"
                            :value-style="{ color: '#3f8600' }"
                            style="margin-right: 10px"
                            >
                            </a-statistic>
                        </a-card>
                    </a-col>
                    <a-col :span="12">
                        <a-card>
                            <a-statistic
                            title="Nothing"
                            :value="0"
                            :precision="2"
                            class="demo-class"
                            :value-style="{ color: '#cf1322' }"
                            >
                                <template #prefix>
                                    <arrow-down-outlined/>
                                </template>
                            </a-statistic>
                        </a-card>
                    </a-col>
                </a-row>
            </div>
        </a-col>
        
        <a-col :span="14">
            <a-row justify="center" type="flex">
                <a-col>
                    <p style="font-size: xx-large">商品状态统计</p>
                </a-col>
            </a-row>
            
            
            <a-row type="flex" :gutter="[128,128]" justify="center">
                
                <a-col :span="2">
                    <a-progress type="circle" :percent="100" :format="() => 'Total:'+this.productTotal "/>
                </a-col>
                <a-col :span="2">
                    <a-progress type="circle" :percent="getPer('0')" :format="() => '未上架:'+getTotal('0')  "/>
                </a-col>
                <a-col :span="2">
                    <a-progress type="circle" :percent="getPer('1')" :format="() => '已上架:'+getTotal('1')"/>
                </a-col>
                
                <a-col :span="2">
                    <a-progress type="circle" :percent="getPer('2') " :format=" ()=>'已下架:'+getTotal('2') ">
                    </a-progress>
                </a-col>
                
                <a-col :span="2">
                    <a-progress type="circle" :percent="getPer('3')" :format="()=>'售罄:'+getTotal('3') ">
                    
                    </a-progress>
                </a-col>
            </a-row>
            <a-row type="flex" justify="center" :gutter="[32,128]" style="margin-top: 32px;" >
                <a-col :span="14">
                    <a-card title="Manage Products" style="width: 100%;">
                        <a-card title="管理产品分类">
                            <template #extra>
                                <a href="/admin/categories_manage">More</a>
                            </template>
                        </a-card>
                        <a-card title="管理产品">
                            <template #extra>
                                <a href="/admin/product_manage">More</a>
                            </template>
                        </a-card>
                        <a-card title="管理订单信息">
                            <template #extra>
                                <a href="/admin/order_manage">More</a>
                            </template>
                        </a-card>
                        
                        <a-card title="订单概览">
                            <template #extra>
                                <a href="/admin/order_info">More</a>
                            </template>
                        </a-card>
                    </a-card>
                </a-col>
            
            </a-row>
        
        
        
        </a-col>
    
    </a-row>
</template>
<script>
import {LikeOutlined} from '@ant-design/icons-vue';
import request from "@/utils/request";

export default {
    name: 'OrderInfo',
    data() {
        return {
            productTotal: 0,
            productByStatus: [],
        }
    },
    created() {
        request({
            url: '/admin/product_statistic_by_status',
            method: 'get',
        }).then(
        res => {
            console.log(res)
            if (res.data.code === 401) {
                this.$store.commit('cleanToken')
                alert("your token is unavailable ")
                this.$router.push("/admin_login")
                console.log(res.data.message)
            } else if (res.data.code === 200) {
                this.productTotal = res.data.data.total
                this.productByStatus = res.data.data.list
            } else {
                console.log(res.data.message)
            }
        }
        ).catch(
        err => console.log(err)
        )
        
    },
    components: {
        LikeOutlined,
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
