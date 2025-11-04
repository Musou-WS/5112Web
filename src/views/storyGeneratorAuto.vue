<template>
    <div class="content">
        <el-form :model="form">
            <div class="plots" v-for="(item, index) in form.plots">
                <el-form-item label="Plots" class="plot">
                    <el-input v-model="form.plots[index]" />
                </el-form-item>
                <el-icon v-if="form.plots.length>1" @click="deleteRelationships(index)" class="delete"><Close /></el-icon>
            </div>
            <el-form-item>
                <el-button type="primary" @click="addRelationships">Add Plots</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-if="isGenerating" disabled>{{ generatingStatus }}<el-icon><Loading /></el-icon></el-button>
                <el-button type="primary" @click="generateStory" v-else>Generate Story</el-button>
            </el-form-item>
            <div class="answer" v-html="storyRebuilt">
            </div>
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
const generatingStatus = ref('')
const relationshipTree = ref('')
const storyInitialized = ref('')
const evidenceChain = ref([])
const unclearParts = ref([])
const storyRebuilt = ref('')

const generateStory = async () => {
    isGenerating.value = true
    generatingStatus.value = 'generating Relationships'
    await generateRelationships()
    generatingStatus.value = 'generating Relationship Tree'
    await generateRelationshipTree()
    generatingStatus.value = 'initializing Story'
    await initializeStory()
    generatingStatus.value = 'building Evidence Chain'
    await buildEvidenceChain()
    generatingStatus.value = 'updating Evidence Chain'
    await updateEvidenceChain()
    generatingStatus.value = 'building Unclear Parts'
    await buildUnclearParts()
    generatingStatus.value = 'updating Unclear Parts'
    await updateUnclearParts()
    generatingStatus.value = 'rebuilding Story'
    await rebuildStory()
    isGenerating.value = false
}

const addRelationships = () => {
    form.plots.push('')
    form.relationships.push('')
}

const modifyContent = (content) => {
    content = content.replaceAll('```html', '')
    content = content.replaceAll('```', '')
    return content
}

const deleteRelationships = (index) => {
    form.plots.splice(index, 1)
    form.relationships.splice(index, 1)
}

const generateRelationships = () => {
    return new Promise((res, rej) => {
        axios.get('/api/generateRelationships', {
            params: {
                plots: form.plots.toString(),
            }
        }).then(
            success=>{
                for(let i=0; i<success.data.length; i++) {
                    form.relationships.splice(i, 1, success.data[i].toString())
                }
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const generateRelationshipTree = () => {
    return new Promise((res, rej) => {
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
                relationshipTree.value = modifyContent(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const initializeStory = () => {
    return new Promise((res, rej) => {
        axios.get('/api/initializeStory', {
            params: {
                content: relationshipTree.value
            }
        }).then(
            success=>{
                storyInitialized.value = modifyContent(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const buildEvidenceChain = () => {
    return new Promise((res, rej) => {
        axios.post('/api/buildEvidenceChain', {
            content: storyInitialized.value
        }).then(
            success=>{
                evidenceChain.value.push(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const updateEvidenceChain = () => {
    return new Promise((res, rej) => {
        axios.post('/api/updateEvidenceChain', {
            content: storyInitialized.value,
            evidenceChain: evidenceChain.value.toString(),
        }).then(
            success=>{
                evidenceChain.value.push(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const buildUnclearParts = () => {
    return new Promise((res, rej) => {
        axios.post('/api/buildUnclearParts', {
            content: storyInitialized.value,
        }).then(
            success=>{
                unclearParts.value.push(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const updateUnclearParts = () => {
    return new Promise((res, rej) => {
        axios.post('/api/updateUnclearParts', {
            content: storyInitialized.value,
            unclearParts: unclearParts.value.toString(),
        }).then(
            success=>{
                unclearParts.value.push(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
}
const rebuildStory = () => {
    return new Promise((res, rej) => {
        axios.post('/api/rebuildStory', {
            content: storyInitialized.value,
            evidenceChain: evidenceChain.value.toString(),
            unclearParts: unclearParts.value.toString(),
        }).then(
            success=>{
                storyRebuilt.value = modifyContent(success.data)
                res(1)
            },
            error=>{
                rej(0)
            }
        )
    })
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
        th {
            background: #FFFFFFDE;
            color: #000000;
        }
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