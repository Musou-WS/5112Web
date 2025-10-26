<template>
    <div class="content">
        <el-form :model="form">
            <div class="plots" v-for="(item, index) in form.plots">
                <el-form-item label="Plots" class="plot">
                    <el-input v-model="form.plots[index]" />
                </el-form-item>
                <el-form-item label="Relationships" class="plot" v-if="form.relationships[index]">
                    <el-input v-model="form.relationships[index]" />
                </el-form-item>
                <el-icon v-if="form.plots.length>1" @click="deleteRelationships(index)" class="delete"><Close /></el-icon>
            </div>
            <el-form-item>
                <el-button type="primary" @click="addRelationships">Add Relationships</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isGenerating" disabled>Generating<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="generateRelationships" v-else>Generate Relationships</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isInitializing" disabled>Initializing<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="InitializeStory" v-else>Initialize Story</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios'

const form = reactive({
    plots: [''],
    relationships: [''],
})
const isGenerating = ref(false)
const isInitializing = ref(false)

const addRelationships = () => {
    form.plots.push('')
    form.relationships.push('')
}

const deleteRelationships = (index) => {
    form.plots.splice(index, 1)
    form.relationships.splice(index, 1)
}

const generateRelationships = () => {
    isGenerating.value = true;
    axios.get('/api/generateRelationships', {
        params: {
            plots: form.plots.toString(),
        }
    }).then(
        success=>{
            for(let i=0; i<success.data.length; i++) {
                form.relationships.splice(i, 1, success.data[i].toString())
            }
            isGenerating.value = false
        },
        error=>{
            isGenerating.value = false
        }
    )
}
const initializeStory = () => {
    
}
</script>

<style lang="scss">
    .content {
        height: calc(100vh - 100px);
        width: calc(100vw - 300px);
        position: fixed;
        right: 0;
        top: 0;
        padding: 50px;
        .plots {
            display: grid;
            grid-template-columns: 1fr 1fr auto;
            grid-gap: 200px;
            align-items: center;
            margin-bottom: 20px;
            .plot {
                margin: 0;
            }
            .delete {
                cursor: pointer;
            }
        }
    }
</style>