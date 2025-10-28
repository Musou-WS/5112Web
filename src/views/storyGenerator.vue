<template>
    <div class="content">
        <el-form :model="form">
            <div class="title">Step 1:</div>
            <div class="plots" v-for="(item, index) in form.plots">
                <el-form-item label="Plots" class="plot">
                    <el-input v-model="form.plots[index]" />
                </el-form-item>
                <el-icon v-if="form.plots.length>1" @click="deleteRelationships(index)" class="delete"><Close /></el-icon>
            </div>
            <el-form-item>
                <el-button type="primary" @click="addRelationships">Add Relationships</el-button>
            </el-form-item>
            <div class="title">Step 2:</div>
            <el-form-item>
                <el-button v-if="isGenerating" disabled>Generating<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="generateRelationships" v-else>Generate Relationships</el-button>
            </el-form-item>
            <div class="relationships" v-for="(item, index) in form.relationships">
                <div class="label">Plots: {{ form.plots[index] }}</div>
                <el-form-item label="Relationships" class="plot">
                    <el-input v-model="form.relationships[index]" />
                </el-form-item>
            </div>
            <div class="title">Step 3:</div>
            <el-form-item>
                <el-button v-if="isGeneratingRelationshipTree" disabled>Generating<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="generateRelationshipTree" v-else>Generate Relationships Tree</el-button>
            </el-form-item>
            <div class="answer">
                {{ relationshipTree }}
            </div>
            <div class="title">Step 4:</div>
            <el-form-item>
                <el-button v-if="isInitializing" disabled>Initializing<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="initializeStory" v-else>Initialize Story</el-button>
            </el-form-item>
            <div class="answer">
                {{ storyInitialized }}
            </div>
            <!-- build evidence chain -->
            <div class="title">Step 5:</div>
            <el-form-item>
                <el-button v-if="isBuildingEvidenceChain" disabled>Building<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="buildEvidenceChain" v-else>Build Evidence Chain</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isUpdatingEvidenceChain" disabled>Updating<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="updateEvidenceChain" v-else>Update Evidence Chain</el-button>
            </el-form-item>
            <div class="answer" v-for="(item, index) in evidenceChain">
                {{ item }}
            </div>
            <!-- build unclear parts chain -->
            <div class="title">Step 6:</div>
            <el-form-item>
                <el-button v-if="isBuildingUnclearParts" disabled>Building<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="buildUnclearParts" v-else>Build Unclear Parts</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isUpdatingUnclearParts" disabled>Updating<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="updateUnclearParts" v-else>Update Unclear Parts</el-button>
            </el-form-item>
            <div class="answer" v-for="(item, index) in unclearParts">
                {{ item }}
            </div>
            <!-- rebuild story -->
            <div class="title">Step 7:</div>
            <el-form-item>
                <el-button v-if="isRebuilding" disabled>Rebuilding<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="rebuildStory" v-else>Rebuild Story</el-button>
            </el-form-item>
            <div class="answer">
                {{ storyRebuilt }}
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios'

const form = reactive({
    plots: ['Alpha murdered Beta', 'Detective Charlie'],
    relationships: ['', ''],
})
const isGenerating = ref(false)
const isGeneratingRelationshipTree = ref(false)
const isInitializing = ref(false)
const isBuildingEvidenceChain = ref(false)
const isUpdatingEvidenceChain = ref(false)
const isBuildingUnclearParts = ref(false)
const isUpdatingUnclearParts = ref(false)
const isRebuilding = ref(false)
const relationshipTree = ref('')
const storyInitialized = ref('')
const evidenceChain = ref([])
const unclearParts = ref([])
const storyRebuilt = ref('')

const addRelationships = () => {
    form.plots.push('')
    form.relationships.push('')
}

const deleteRelationships = (index) => {
    form.plots.splice(index, 1)
    form.relationships.splice(index, 1)
}

const generateRelationships = () => {
    isGenerating.value = true
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
const generateRelationshipTree = () => {
    isGeneratingRelationshipTree.value = true
    let content = '';
    for(let i=0; i<form.plots.length; i++) {
        content += 'relationships in plot '+form.plots[i]+' are '+form.relationships[i]
    }
    axios.get('/api/generateRelationshipTree', {
        params: {
            content,
        }
    }).then(
        success=>{
            relationshipTree.value = success.data
            isGeneratingRelationshipTree.value = false
        },
        error=>{
            isGeneratingRelationshipTree.value = false
        }
    )
}
const initializeStory = () => {
    isInitializing.value = true
    axios.get('/api/initializeStory', {
        params: {
            content: relationshipTree.value
        }
    }).then(
        success=>{
            storyInitialized.value = success.data
            isInitializing.value = false
        },
        error=>{
            isInitializing.value = false
        }
    )
}
const buildEvidenceChain = () => {
    isBuildingEvidenceChain.value = true
    axios.get('/api/buildEvidenceChain', {
        params: {
            content: storyInitialized.value
        }
    }).then(
        success=>{
            evidenceChain.value.push(success.data)
            isBuildingEvidenceChain.value = false
        },
        error=>{
            isBuildingEvidenceChain.value = false
        }
    )
}
const updateEvidenceChain = () => {
    isUpdatingEvidenceChain.value = true
    axios.get('/api/updateEvidenceChain', {
        params: {
            content: storyInitialized.value,
            evidenceChain: evidenceChain.value.toString(),
        }
    }).then(
        success=>{
            evidenceChain.value.push(success.data)
            isUpdatingEvidenceChain.value = false
        },
        error=>{
            isUpdatingEvidenceChain.value = false
        }
    )
}
const buildUnclearParts = () => {
    isBuildingUnclearParts.value = true
    axios.get('/api/buildUnclearParts', {
        params: {
            content: storyInitialized.value,
        }
    }).then(
        success=>{
            unclearParts.value.push(success.data)
            isBuildingUnclearParts.value = false
        },
        error=>{
            isBuildingUnclearParts.value = false
        }
    )
}
const updateUnclearParts = () => {
    isUpdatingUnclearParts.value = true
    axios.get('/api/updateUnclearParts', {
        params: {
            content: storyInitialized.value,
            unclearParts: unclearParts.value.toString(),
        }
    }).then(
        success=>{
            unclearParts.value.push(success.data)
            isUpdatingUnclearParts.value = false
        },
        error=>{
            isUpdatingEvidenceChain.value = false
        }
    )
}
const rebuildStory = () => {
    isRebuilding.value = true
    axios.get('/api/rebuildStory', {
        params: {
            content: storyInitialized.value,
            evidenceChain: evidenceChain.value.toString(),
            unclearParts: unclearParts.value.toString(),
        }
    }).then(
        success=>{
            storyRebuilt.value = success.data
            isRebuilding.value = false
        },
        error=>{
            isRebuilding.value = false
        }
    )
}
</script>

<style lang="scss">
    .content {
        height: calc(100vh - 200px);
        width: calc(100vw - 400px);
        position: fixed;
        right: 0;
        top: 0;
        padding: 100px 100px 100px 100px;
        overflow-y: auto;
        .title {
            text-align: start;
            margin-bottom: 20px;
        }
        .answer {
            text-align: start;
            margin-bottom: 20px;
            text-indent: 32px;
        }
        .plots {
            display: grid;
            grid-template-columns: 1fr auto;
            grid-gap: 20px;
            align-items: center;
            margin-bottom: 20px;
            .plot {
                margin: 0;
            }
            .delete {
                cursor: pointer;
            }
        }
        .relationships {
            .label {
                text-align: start;
                color: #606266;
                font-size: 14px;
                margin-bottom: 5px;
            }
        }
    }
</style>