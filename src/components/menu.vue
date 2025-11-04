<template>
    <div class="menu">
        <el-menu
            background-color="#000000"
            text-color="#cccccc"
            :collapse="isCollapse"
            class="menu_list"
            :router="true"
            :default-active="activeLink"
        >
            <el-menu-item @click="handleCollapse" class="btn">
                <el-icon>
                    <Expand v-if="isCollapse" />
                    <Fold v-else />
                </el-icon>
            </el-menu-item>
            <el-menu-item index="/">
                <el-icon><House /></el-icon>
                <span>Story Generator</span>
            </el-menu-item>
            <el-menu-item index="/auto">
                <el-icon><HomeFilled /></el-icon>
                <span>Auto Story Generator</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const activeLink = ref(route.path);

watch(
    () => route.path,
    (newPath) => {
    activeLink.value = newPath;
    }
);

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