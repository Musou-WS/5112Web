<template>
    <div class="menu">
        <el-menu
            background-color="#000000"
            text-color="#cccccc"
            default-active="1"
            :collapse="isCollapse"
            class="menu_list"
        >
            <el-menu-item @click="handleCollapse" class="btn">
                <el-icon>
                    <Expand v-if="isCollapse" />
                    <Fold v-else />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="1">
                <el-icon><House /></el-icon>
                <span>Generate Story</span>
            </el-menu-item>
            <el-menu-item index="2">
                <el-icon><House /></el-icon>
                <span>Basic AI Agent</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isCollapse = ref(true)

const handleCollapse = () => {
    isCollapse.value = !isCollapse.value
}
</script>

<style lang="scss">
.menu {
    background-color: transparent;
    position: fixed;
    height: 100vh;
    width: 200px;
    left: 0;
    top: 0;
    .menu_list {
        border: none;
        height: 100%;
    }
}
</style>