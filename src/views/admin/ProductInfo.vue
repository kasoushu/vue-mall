<template>
    <a-row justify="center" align="middle" :gutter="16">
        <a-col :span="12">
            <a-statistic title="Feedback" :value="1128" style="margin-right: 20px">
                <template #suffix>
                    <like-outlined/>
                </template>
            </a-statistic>
        </a-col>
        <a-col :span="12">
            <a-statistic title="Unmerged" :value="93" class="demo-class">
                <template #suffix>
                    <span>/ 100</span>
                </template>
            </a-statistic>
        </a-col>
    </a-row>
    <a-row>
        <a-col :span="8">
            <a-row>
                <a-col>
                    <p>Total</p>
                </a-col>
            </a-row>
         <a-progress type="circle" :percent="100" :format="() => this.productData.total "/>
        </a-col>
        
        <a-col :span="16">
            <a-row justify="center">
                <a-col >
                    <p>商品状态统计</p>
                </a-col>
            </a-row>
            
            <a-row>
                <a-col :span="4">
                    <a-progress type="circle" :percent="getPer('0')" :format="() => 'Not Done'"/>
                </a-col>
                
                <a-col :span="4">
                    <a-progres type="circle" :percent="getPer('1')" :format="() => 'Done'"/>
                
                </a-col>
                
                <a-col :span="4">
                    <a-progress type="circle" :percent="getPer('2')">
                        <template #format="percent">
                            <span style="color: red">{{ percent }}</span>
                        </template>
                    </a-progress>
                </a-col>
    
                <a-col :span="4">
                    <a-progress type="circle" :percent="getPer('3')">
                        <template #format="percent">
                            <span style="color: red">{{ percent }}</span>
                        </template>
                    </a-progress>
                </a-col>
            </a-row>
        </a-col>
    
    </a-row>
</template>
<script>
import { LikeOutlined } from '@ant-design/icons-vue';
import request from "@/utils/request";
export default {
    name:'ProductInfo',
    data(){
      return{
          productData:{
            total:0,
            productByStatus:[],
          },
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
                this.productData.total = res.data.data.total;
                this.productData.productByStatus = res.data.data.list;
                console.log(this.productData)
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
    computed:{
      
        getPer(){
            return (status) =>{
                switch (status) {
                    case '0' : return this.productData.productByStatus[0].total *100 /this.productData.total ;
                    // case '1' : return this.productData.productByStatus[1].total *100 /this.productData.total  ;
                    // case '2' : return this.productData.productByStatus[2].total *100 /this.productData.total  ;
                    // case '3' : return this.productData.productByStatus[3].total *100 /this.productData.total  ;
                }
            }
        }
        
    },
};
</script>
