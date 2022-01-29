<template>
    <div>
        <p style="font-size: xx-large">
            Welcome to mall manage panel
        </p>
        <a-row type="flex" justify="end" :gutter="[32,128]" style="margin-top: 32px;" >
                <a-col :span="14">
                    <a-card title="导航" style="width: 100%;">
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
    </div>
</template>

<script>
export default {
    name: "Home"
}
</script>

<style scoped>

</style>